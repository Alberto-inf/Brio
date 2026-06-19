'use client';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { CartLine } from '@/lib/CartContext';
import type { Database, OrderItem, Profile } from '@/lib/database.types';

const STORAGE_KEY = 'brio-cart-v2';

function readLocalCart(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function clearLocalCart() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

export async function mergeCartOnLogin(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const lines = readLocalCart();
  if (lines.length === 0) {
    // Aseguramos que existe fila de perfil (por si el trigger no está creado)
    const { error: upsertErr } = await supabase
      .from('profiles')
      .upsert({ id: userId } as ProfileInsert, { onConflict: 'id' });
    if (upsertErr) {
      throw upsertErr;
    }
    return;
  }

  const totalCents = Math.round(
    lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0) * 100
  );

  const orderInsert: OrderInsert = {
    user_id: userId,
    status: 'pending',
    total_cents: totalCents,
    currency: 'EUR',
  };

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert(orderInsert)
    .select('id')
    .single<{ id: string }>();

  if (orderErr || !order) {
    throw orderErr ?? new Error('No se pudo crear el pedido.');
  }

  const items: OrderItemInsert[] = lines.map((l) => ({
    order_id: order.id,
    product_id: l.product.id,
    name: l.product.name,
    unit_price_cents: Math.round(l.product.price * 100),
    quantity: l.quantity,
    size: l.size,
    color: l.color,
  }));

  const { error: itemsErr } = await supabase.from('order_items').insert(items);
  if (itemsErr) {
    throw itemsErr;
  }

  // Aseguramos fila de perfil vacía
  await supabase
    .from('profiles')
    .upsert({ id: userId } as ProfileInsert, { onConflict: 'id' });

  clearLocalCart();
}

export async function placeOrder(
  supabase: SupabaseClient,
  userId: string,
  lines: CartLine[]
): Promise<{ orderId: string } | { error: string }> {
  if (lines.length === 0) return { error: 'El carrito está vacío.' };

  const totalCents = Math.round(
    lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0) * 100
  );

  const orderInsert: OrderInsert = {
    user_id: userId,
    status: 'pending',
    total_cents: totalCents,
    currency: 'EUR',
  };

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert(orderInsert)
    .select('id')
    .single<{ id: string }>();

  if (orderErr || !order) {
    return { error: orderErr?.message ?? 'No se pudo crear el pedido.' };
  }

  const items: OrderItem[] = lines.map((l) => ({
    id: crypto.randomUUID(),
    order_id: order.id,
    product_id: l.product.id,
    name: l.product.name,
    unit_price_cents: Math.round(l.product.price * 100),
    quantity: l.quantity,
    size: l.size,
    color: l.color,
  }));

  const { error: itemsErr } = await supabase.from('order_items').insert(items);
  if (itemsErr) return { error: itemsErr.message };

  return { orderId: order.id };
}
