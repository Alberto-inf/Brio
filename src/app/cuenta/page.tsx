import { Suspense } from 'react';
import AccountClient from './AccountClient';

export const metadata = {
  title: 'Mi cuenta — Brío',
  description: 'Gestiona tus datos y consulta tus pedidos.',
};

export default function CuentaPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.32em] text-brio-silver mb-3">
          Mi cuenta
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-brio-white text-balance">
          Tu espacio Brío
        </h1>
      </header>

      <Suspense fallback={<p className="text-sm text-brio-white/50">Cargando…</p>}>
        <AccountClient />
      </Suspense>
    </section>
  );
}
