'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import { useToast } from '@/lib/Toast';
import { IconHeart, IconCart } from '@/components/ui/Icons';
import { formatPrice, cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, onQuickView, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { has, toggle: toggleFav } = useFavorites();
  const { show } = useToast();
  const isFav = has(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0], product.colors[0].name, 1);
    show(`${product.name} añadido al carrito`);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFav(product.id);
    show(added ? 'Guardado en favoritos' : 'Eliminado de favoritos', 'info');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4) }}
      className="group"
    >
      <Link
        href={`/producto/${product.id}`}
        className="block"
        onClick={(e) => {
          // Si pulsó en el overlay zone dejamos navegar; las zonas interactivas hacen stopPropagation
        }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-brio-gray">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-brio-silver text-brio-black text-[9px] font-semibold px-2 py-1 uppercase tracking-[0.2em]">
                Nuevo
              </span>
            )}
            {product.isExclusive && (
              <span className="bg-brio-white text-brio-black text-[9px] font-semibold px-2 py-1 uppercase tracking-[0.2em]">
                Exclusivo
              </span>
            )}
            {product.isOutlet && discount > 0 && (
              <span className="bg-brio-black text-brio-silver border border-brio-silver text-[9px] font-semibold px-2 py-1 uppercase tracking-[0.2em]">
                −{discount}%
              </span>
            )}
          </div>

          {/* Favorito */}
          <button
            type="button"
            onClick={handleFav}
            aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            className={cn(
              'absolute top-3 right-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300',
              isFav
                ? 'border-brio-silver bg-brio-silver text-brio-black'
                : 'border-brio-white/30 bg-brio-black/40 text-brio-white hover:border-brio-silver hover:text-brio-silver backdrop-blur'
            )}
          >
            <IconHeart className="w-4 h-4" filled={isFav} strokeWidth={1.6} />
          </button>

          {/* Imagen */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Imagen secundaria en hover (si existe) */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              aria-hidden
            />
          )}

          {/* Overlay con acciones al hover (desktop) */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-3 hidden md:flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-full bg-brio-white text-brio-black text-[10px] uppercase tracking-[0.28em] py-3 hover:bg-brio-silver-soft transition-colors flex items-center justify-center gap-2"
            >
              <IconCart className="w-3.5 h-3.5" />
              Añadir
            </button>
            <button
              type="button"
              onClick={handleQuickView}
              className="w-full bg-brio-black/70 text-brio-white border border-brio-line-strong text-[10px] uppercase tracking-[0.28em] py-3 hover:bg-brio-black/90 transition-colors backdrop-blur"
            >
              Vista rápida
            </button>
          </div>
        </div>

        <div className="pt-4 space-y-1.5">
          <h3 className="text-sm font-medium text-brio-white group-hover:text-brio-silver transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-brio-white">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-brio-white/40 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="inline-block h-2.5 w-2.5 rounded-full border border-brio-line-strong"
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
