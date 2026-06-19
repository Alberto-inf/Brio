'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, isProfileComplete } from '@/lib/auth/AuthContext';
import ProfileForm from '@/components/auth/ProfileForm';
import DeleteAccountButton from '@/components/auth/DeleteAccountButton';
import type { Order, OrderItem } from '@/lib/database.types';
import { formatPrice } from '@/lib/utils';

type OrderWithItems = Order & { items: OrderItem[] };

export default function AccountClient() {
  const { user, status, supabase, profile, profileStatus, profileComplete } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (status !== 'ready' || !user || !supabase) return;
    if (!profileComplete) {
      setOrders(null);
      setOrdersLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setOrdersLoading(true);
      const { data: orderRows, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error || !orderRows) {
        setOrders([]);
        setOrdersLoading(false);
        return;
      }
      const ids = (orderRows as Order[]).map((o) => o.id);
      const { data: itemRows } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', ids);
      const byOrder = new Map<string, OrderItem[]>();
      (itemRows as OrderItem[] | null)?.forEach((it) => {
        const arr = byOrder.get(it.order_id) ?? [];
        arr.push(it);
        byOrder.set(it.order_id, arr);
      });
      const merged = (orderRows as Order[]).map<OrderWithItems>((o) => ({
        ...o,
        items: byOrder.get(o.id) ?? [],
      }));
      setOrders(merged);
      setOrdersLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [status, user, supabase, profileComplete]);

  if (status === 'loading' || profileStatus === 'loading') {
    return <p className="text-sm text-brio-white/60">Cargando…</p>;
  }
  if (status === 'disabled' || !user) {
    return (
      <p className="text-sm text-brio-white/60">
        Para acceder a tu cuenta necesitas iniciar sesión.
      </p>
    );
  }

  const needsEssential = !isProfileComplete(profile);

  return (
    <div className="space-y-12">
      {needsEssential && (
        <section className="border border-brio-silver/30 bg-brio-silver/5 p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.32em] text-brio-silver mb-3">
            Bienvenida
          </p>
          <h2 className="font-serif text-2xl text-brio-white mb-2 text-balance">
            Cuéntanos quién eres
          </h2>
          <p className="text-sm text-brio-white/70 mb-6 max-w-prose">
            Para poder enviarte tus pedidos necesitamos tu nombre y teléfono. La dirección
            podrás completarla más tarde desde esta misma página.
          </p>
          <ProfileForm
            mode="essential"
            submitLabel="Guardar y continuar"
          />
        </section>
      )}

      <section>
        <h2 className="font-serif text-2xl text-brio-white mb-2">Datos de envío</h2>
        <p className="text-sm text-brio-white/60 mb-6">
          Dirección completa. La usaremos para enviarte tus pedidos.
        </p>
        <ProfileForm
          mode="full"
          submitLabel="Guardar dirección"
        />
      </section>

      <section>
        <h2 className="font-serif text-2xl text-brio-white mb-6">Mis pedidos</h2>

        {!profileComplete ? (
          <p className="text-sm text-brio-white/50 border border-brio-line p-6">
            Tus pedidos aparecerán aquí cuando completes tus datos básicos.
          </p>
        ) : ordersLoading ? (
          <p className="text-sm text-brio-white/50">Cargando pedidos…</p>
        ) : !orders || orders.length === 0 ? (
          <div className="border border-brio-line p-6 text-sm text-brio-white/60">
            <p>Aún no tienes pedidos.</p>
            <Link
              href="/colecciones"
              className="inline-block mt-3 text-brio-silver hover:text-brio-white underline-offset-4 hover:underline"
            >
              Explorar colecciones →
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((o) => (
              <li key={o.id} className="border border-brio-line p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-brio-white/50">
                    Pedido · {new Date(o.created_at).toLocaleDateString('es-ES')}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-brio-silver border border-brio-silver/40 px-2 py-1">
                    {o.status}
                  </span>
                </div>
                <p className="font-serif text-lg text-brio-white">
                  Total: {formatPrice(o.total_cents / 100)}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-brio-white/70">
                  {o.items.map((it) => (
                    <li key={it.id} className="flex justify-between gap-3">
                      <span className="truncate">
                        {it.name}
                        {it.size ? ` · ${it.size}` : ''}
                        {it.color ? ` · ${it.color}` : ''} · ×{it.quantity}
                      </span>
                      <span className="text-brio-white/60">
                        {formatPrice((it.unit_price_cents * it.quantity) / 100)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <DeleteAccountButton />
    </div>
  );
}
