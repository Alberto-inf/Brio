import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const Body = z.object({
  email: z.string().trim().toLowerCase().email('Email no válido.'),
  type: z.enum(['signup', 'reset']).default('signup'),
});

// Límite local: 1 petición cada 30 s por IP, para no abusar de Supabase
// ni que un bot te consuma la cuota de Gmail.
const recent = new Map<string, number>();
const WINDOW_MS = 30_000;

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const last = recent.get(ip) ?? 0;
  const now = Date.now();
  if (now - last < WINDOW_MS) {
    const wait = Math.ceil((WINDOW_MS - (now - last)) / 1000);
    return NextResponse.json(
      { ok: false, error: 'RATE_LIMIT', retryIn: wait },
      { status: 429 }
    );
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (e) {
    const message =
      e instanceof z.ZodError ? e.issues[0]?.message ?? 'Datos inválidos.' : 'Datos inválidos.';
    return NextResponse.json({ ok: false, error: 'INVALID_INPUT', message }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.json(
      { ok: false, error: 'SERVER_NOT_CONFIGURED' },
      { status: 500 }
    );
  }

  // Cliente sin sesión (no queremos que un usuario logueado "robe" el flujo).
  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const redirectTo = `${new URL(req.url).origin}/cuenta`;

  const { error } =
    body.type === 'reset'
      ? await supabase.auth.resetPasswordForEmail(body.email, { redirectTo })
      : await supabase.auth.resend({
          type: 'signup',
          email: body.email,
          options: { emailRedirectTo: redirectTo },
        });

  if (error) {
    // No le confirmamos al cliente si el email existe o no (evita
    // enumeración de cuentas). Devolvemos ok:true siempre que el
    // formato del email sea válido.
    console.warn('[auth/resend] supabase error:', error.message);
  }

  recent.set(ip, now);
  // Limpieza periódica del mapa
  if (recent.size > 1000) {
    for (const [k, t] of recent) {
      if (now - t > WINDOW_MS) recent.delete(k);
    }
  }

  return NextResponse.json({ ok: true });
}
