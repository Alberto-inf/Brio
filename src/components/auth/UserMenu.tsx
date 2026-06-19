'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { IconUser, IconChevronDown } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

export default function UserMenu() {
  const { user, status, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  if (status === 'loading') {
    return (
      <div
        className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-full border border-brio-line text-brio-white/30"
        aria-label="Cargando sesión"
      >
        <IconUser className="w-4 h-4" />
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        aria-label="Iniciar sesión"
        className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-full border border-brio-line text-brio-white/80 hover:border-brio-silver hover:text-brio-white transition-colors"
      >
        <IconUser className="w-4 h-4" />
      </Link>
    );
  }

  const email = user.email ?? '';
  const initial = (email[0] ?? '?').toUpperCase();

  return (
    <div ref={ref} className="hidden lg:block relative">
      <button
        type="button"
        aria-label="Menú de cuenta"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 h-10 pl-1.5 pr-3 rounded-full border border-brio-line text-brio-white/90 hover:border-brio-silver hover:text-brio-white transition-colors"
      >
        <span className="h-7 w-7 rounded-full bg-brio-silver text-brio-black text-xs font-semibold flex items-center justify-center">
          {initial}
        </span>
        <IconChevronDown
          className={cn('w-3 h-3 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[220px] border border-brio-line bg-brio-black/95 backdrop-blur-xl shadow-2xl py-2 z-50">
          <div className="px-4 py-2 border-b border-brio-line">
            <p className="text-[10px] uppercase tracking-[0.24em] text-brio-white/50">
              Sesión iniciada
            </p>
            <p className="text-sm text-brio-white truncate" title={email}>
              {email}
            </p>
          </div>
          <Link
            href="/cuenta"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-brio-white/80 hover:text-brio-white hover:bg-brio-gray-light/40 transition-colors"
          >
            Mi cuenta
          </Link>
          <Link
            href="/favoritos"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-brio-white/80 hover:text-brio-white hover:bg-brio-gray-light/40 transition-colors"
          >
            Favoritos
          </Link>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await signOut();
              router.replace('/');
              router.refresh();
            }}
            className="w-full text-left block px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-brio-white/80 hover:text-brio-white hover:bg-brio-gray-light/40 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
