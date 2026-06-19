import { Suspense } from 'react';
import AuthForm from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Acceso — Brío',
  description: 'Inicia sesión o crea tu cuenta en Brío.',
};

export default function LoginPage() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full">
        <header className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.32em] text-brio-silver mb-3">
            Brío
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-brio-white text-balance">
            Bienvenida de nuevo
          </h1>
          <p className="mt-3 text-sm text-brio-white/60 max-w-sm mx-auto">
            Inicia sesión o crea una cuenta para guardar tus datos de envío y consultar tus
            pedidos.
          </p>
        </header>

        <Suspense fallback={null}>
          <AuthForm />
        </Suspense>
      </div>
    </section>
  );
}
