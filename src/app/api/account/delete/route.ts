import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) {
    return NextResponse.json(
      { ok: false, error: 'SERVER_NOT_CONFIGURED' },
      { status: 500 }
    );
  }

  // 1) Identificamos al usuario desde su cookie de sesión (JWT del navegador).
  const userClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const {
    data: { user },
    error: userErr,
  } = await userClient.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  // 2) Cliente admin (service_role). Sólo se usa en el servidor, NUNCA en cliente.
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 3) Comprobamos si tiene pedidos en proceso.
  // MVP: bloqueamos si hay pedidos en estado 'pending' o 'paid'.
  // Cuando integres pagos/envíos, añade 'shipped' a esta lista si quieres.
  const { count: blockingOrders, error: ordersErr } = await admin
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['pending', 'paid']);

  if (ordersErr) {
    return NextResponse.json({ ok: false, error: 'CHECK_FAILED' }, { status: 500 });
  }
  if (typeof blockingOrders === 'number' && blockingOrders > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: 'HAS_ACTIVE_ORDERS',
        message:
          'No puedes eliminar tu cuenta mientras tengas pedidos en curso. ' +
          'Espera a que se entreguen o cancelen y vuelve a intentarlo.',
      },
      { status: 409 }
    );
  }

  // 4) Borramos al usuario de auth.users. Esto elimina en cascada profiles
  //    y deja los pedidos existentes con user_id = NULL (gracias a ON DELETE SET NULL).
  const { error: deleteErr } = await admin.auth.admin.deleteUser(user.id);
  if (deleteErr) {
    return NextResponse.json({ ok: false, error: 'DELETE_FAILED' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
