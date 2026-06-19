'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

type Phase = 'idle' | 'confirming' | 'deleting' | 'blocked';

export default function DeleteAccountButton() {
  const router = useRouter();
  const { forceSignOut } = useAuth();
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);

  async function doDelete() {
    setError(null);
    setPhase('deleting');
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (res.ok && data.ok) {
        await forceSignOut();
        router.replace('/');
        router.refresh();
        return;
      }

      if (res.status === 409) {
        setError(
          data.message ??
            'Tienes pedidos en curso. Espera a que se entreguen o cancelen y vuelve a intentarlo.'
        );
        setPhase('blocked');
        return;
      }

      setError('No se pudo eliminar la cuenta. Inténtalo de nuevo más tarde.');
      setPhase('idle');
    } catch {
      setError('Error de red. Inténtalo de nuevo.');
      setPhase('idle');
    }
  }

  return (
    <section className="border border-red-300/20 bg-red-500/[0.03] p-6 md:p-8">
      <p className="text-[10px] uppercase tracking-[0.32em] text-red-300/80 mb-3">
        Zona peligrosa
      </p>
      <h2 className="font-serif text-2xl text-brio-white mb-2 text-balance">
        Eliminar mi cuenta
      </h2>
      <p className="text-sm text-brio-white/60 mb-5 max-w-prose">
        Al eliminar tu cuenta se borrarán tus datos de perfil. Los pedidos ya
        completados se mantienen en el sistema con fines contables, pero dejarán de
        estar asociados a tu identidad.
      </p>

      {phase === 'idle' && (
        <button
          type="button"
          onClick={() => setPhase('confirming')}
          className="inline-flex items-center justify-center px-6 py-3 text-[11px] uppercase tracking-[0.28em] font-medium border border-red-300/40 text-red-300/90 hover:bg-red-500/10 hover:text-red-200 hover:border-red-300/60 transition-colors disabled:opacity-50"
        >
          Eliminar mi cuenta
        </button>
      )}

      {phase === 'confirming' && (
        <div className="space-y-4">
          <p className="text-sm text-brio-white/80">
            ¿Estás segura? Esta acción no se puede deshacer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={doDelete}
              className="inline-flex items-center justify-center px-6 py-3 text-[11px] uppercase tracking-[0.28em] font-medium bg-red-500/90 text-white hover:bg-red-500 transition-colors"
            >
              Sí, eliminar definitivamente
            </button>
            <button
              type="button"
              onClick={() => {
                setPhase('idle');
                setError(null);
              }}
              className="inline-flex items-center justify-center px-6 py-3 text-[11px] uppercase tracking-[0.28em] font-medium border border-brio-line-strong text-brio-white/80 hover:text-brio-white hover:border-brio-silver transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {phase === 'deleting' && (
        <p className="text-sm text-brio-white/60">Eliminando cuenta…</p>
      )}

      {(phase === 'idle' || phase === 'blocked') && error && (
        <p className="mt-4 text-sm text-red-300/90 border border-red-300/30 bg-red-500/5 px-4 py-3">
          {error}
        </p>
      )}
    </section>
  );
}
