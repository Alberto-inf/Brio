import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/CartContext';
import { FavoritesProvider } from '@/lib/FavoritesContext';
import { ToastProvider } from '@/lib/Toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';

export const metadata: Metadata = {
  title: 'Brío — Elegancia que nace de la actitud',
  description:
    'Tienda de moda femenina en negro. Prendas de alta calidad, conjuntos exclusivos y piezas atemporales para mujeres que eligen por sí mismas.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-brio-black text-brio-white">
        <ToastProvider>
          <FavoritesProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </CartProvider>
          </FavoritesProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
