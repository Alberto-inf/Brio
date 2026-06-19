'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { LoginSchema, SignupSchema } from '@/lib/auth/schemas';
import Button from '@/components/ui/Button';

type Mode = 'login' | 'signup';

export default function AuthForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/cuenta';
  const { signIn, signUp, signOut, forceSignOut, status, user } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  // Cuenta atrás del cooldown del reenvío
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  async function handleResend() {
    if (!pendingEmail || resending || resendIn > 0) return;
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, type: 'signup' }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; retryIn?: number };
      if (res.status === 429) {
        setResendIn(data.retryIn ?? 30);
      } else {
        setResendIn(30);
      }
    } catch {
      setResendIn(30);
    } finally {
      setResending(false);
    }
  }

  if (status === 'disabled') {
    return (
      <div className="border border-brio-line bg-brio-gray/40 p-6 text-sm text-brio-white/80">
        <p className="font-medium text-brio-white mb-2">Login no configurado</p>
        <p className="text-brio-white/60">
          Añade <code className="text-brio-silver">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
          <code className="text-brio-silver">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> a tu{' '}
          <code className="text-brio-silver">.env.local</code> y reinicia el servidor.
        </p>
      </div>
    );
  }

  // Si ya hay sesión abierta, mostramos un panel con opciones en vez de
  // redirigir a /cuenta (que provocaba un bucle al recargar la página).
  if (status === 'ready' && user) {
    async function handleSignOut() {
      if (signingOut) return;
      setSigningOut(true);
      try {
        // Timeout UI: si en 5 s no ha vuelto, mostramos el botón de forzar.
        const signOutPromise = signOut();
        const timeout = new Promise<void>((resolve) => setTimeout(resolve, 5000));
        await Promise.race([signOutPromise, timeout]);
        router.refresh();
      } finally {
        setSigningOut(false);
      }
    }

    async function handleForceSignOut() {
      setSigningOut(true);
      try {
        await forceSignOut();
        router.refresh();
      } finally {
        setSigningOut(false);
      }
    }

    return (
      <div className="w-full max-w-md mx-auto">
        <div className="border border-brio-line bg-brio-gray/40 p-6 text-sm text-brio-white/80 space-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-brio-silver mb-2">
              Sesión activa
            </p>
            <p className="text-brio-white">
              Ya tienes una sesión iniciada como <strong>{user.email}</strong>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button href={next} className="flex-1">
              Ir a mi cuenta
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? 'Cerrando…' : 'Cerrar sesión'}
            </Button>
          </div>
          {signingOut && (
            <button
              type="button"
              onClick={handleForceSignOut}
              className="block w-full text-center text-xs text-red-300/80 hover:text-red-300 transition-colors underline-offset-4 hover:underline"
            >
              Tarda demasiado · Forzar cierre
            </button>
          )}
          {!signingOut && (
            <button
              type="button"
              onClick={handleSignOut}
              className="block w-full text-center text-xs text-brio-white/50 hover:text-brio-white transition-colors underline-offset-4 hover:underline"
            >
              Iniciar sesión con otro usuario
            </button>
          )}
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setFieldErrors({});

    const schema = mode === 'login' ? LoginSchema : SignupSchema;
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        const { error: err } = await signIn(parsed.data);
        if (err) {
          setError(err);
        } else {
          router.replace(next);
          router.refresh();
        }
      } else {
        const { error: err } = await signUp(parsed.data);
        if (err) {
          setError(err);
        } else {
          // Si Supabase abre sesión al registrarse (Confirm email OFF) el useEffect
          // anterior nos llevará a /cuenta. Si requiere confirmación, lo decimos.
          setPendingEmail(parsed.data.email);
          setInfo(
            'Te hemos enviado un email de confirmación. Revisa tu bandeja (y Spam) y, cuando lo confirmes, vuelve aquí para completar tus datos.'
          );
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex border border-brio-line mb-8">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError(null);
            setInfo(null);
            setFieldErrors({});
          }}
          className={`flex-1 py-3 text-[11px] uppercase tracking-[0.24em] transition-colors ${
            mode === 'login'
              ? 'bg-brio-white text-brio-black'
              : 'text-brio-white/70 hover:text-brio-white'
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setError(null);
            setInfo(null);
            setFieldErrors({});
          }}
          className={`flex-1 py-3 text-[11px] uppercase tracking-[0.24em] transition-colors ${
            mode === 'signup'
              ? 'bg-brio-white text-brio-black'
              : 'text-brio-white/70 hover:text-brio-white'
          }`}
        >
          Crear cuenta
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-[10px] uppercase tracking-[0.24em] text-brio-white/60 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border border-brio-line-strong px-4 py-3 text-brio-white placeholder:text-brio-white/30 focus:outline-none focus:border-brio-silver transition-colors"
            placeholder="tu@email.com"
          />
          {fieldErrors.email?.[0] && (
            <p className="mt-2 text-xs text-red-300/90">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-[10px] uppercase tracking-[0.24em] text-brio-white/60 mb-2"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-transparent border border-brio-line-strong px-4 py-3 text-brio-white placeholder:text-brio-white/30 focus:outline-none focus:border-brio-silver transition-colors"
            placeholder="Mínimo 8 caracteres"
          />
          {fieldErrors.password?.[0] && (
            <p className="mt-2 text-xs text-red-300/90">{fieldErrors.password[0]}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-300/90 border border-red-300/30 bg-red-500/5 px-4 py-3">
            {error}
          </p>
        )}
        {info && (
          <div className="space-y-3">
            <p className="text-sm text-brio-silver border border-brio-silver/30 bg-brio-silver/5 px-4 py-3">
              {info}
            </p>
            {pendingEmail && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || resendIn > 0}
                className="block w-full text-center text-xs text-brio-white/70 hover:text-brio-white transition-colors underline-offset-4 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending
                  ? 'Reenviando…'
                  : resendIn > 0
                    ? `Reenviar email en ${resendIn}s`
                    : '¿No te ha llegado? Reenviar email'}
              </button>
            )}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting || status !== 'ready'}
        >
          {submitting
            ? 'Procesando…'
            : mode === 'login'
              ? 'Iniciar sesión'
              : 'Crear cuenta'}
        </Button>

        <p className="text-xs text-brio-white/50 text-center pt-2">
          {mode === 'login' ? (
            <>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-brio-silver hover:text-brio-white transition-colors underline-offset-4 hover:underline"
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-brio-silver hover:text-brio-white transition-colors underline-offset-4 hover:underline"
              >
                Inicia sesión
              </button>
            </>
          )}
        </p>
      </form>

      <p className="mt-8 text-[11px] text-brio-white/40 text-center">
        Al continuar aceptas nuestros{' '}
        <Link href="/sobre-nosotros" className="underline hover:text-brio-white/60">
          términos y política de privacidad
        </Link>
        .
      </p>
    </div>
  );
}
