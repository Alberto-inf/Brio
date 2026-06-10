'use client';

import { useFavorites } from '@/lib/FavoritesContext';
import { products } from '@/lib/products';
import ProductGrid from '@/components/product/ProductGrid';
import Link from 'next/link';
import { IconHeart, IconArrowRight } from '@/components/ui/Icons';

export default function FavoritosPage() {
  const { ids, count } = useFavorites();
  const items = products.filter((p) => ids.includes(p.id));

  if (count === 0) {
    return (
      <div className="min-h-[60vh] bg-brio-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-brio-line mb-6 text-brio-silver">
            <IconHeart className="w-6 h-6" />
          </span>
          <h1 className="font-serif text-3xl md:text-4xl italic text-brio-white mb-3">
            Sin favoritos todavía
          </h1>
          <p className="text-sm text-brio-white/55 mb-8">
            Pulsa el corazón en cualquier producto para guardarlo aquí. Te avisaremos cuando vuelva
            a estar disponible.
          </p>
          <Link
            href="/colecciones"
            className="inline-flex items-center gap-3 bg-brio-white text-brio-black text-[10px] uppercase tracking-[0.32em] px-7 py-4 hover:bg-brio-silver-soft transition-colors"
          >
            Explorar colección
            <IconArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brio-black min-h-[60vh]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <header className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.5em] text-brio-silver mb-3 flex items-center gap-3">
            <span className="block w-8 h-px bg-brio-silver" />
            Tu wishlist
          </p>
          <h1 className="font-serif text-4xl md:text-5xl italic text-brio-white">
            Favoritos
          </h1>
          <p className="mt-2 text-sm text-brio-white/55">
            {count} {count === 1 ? 'pieza guardada' : 'piezas guardadas'}
          </p>
        </header>

        <ProductGrid products={items} />
      </div>
    </div>
  );
}
