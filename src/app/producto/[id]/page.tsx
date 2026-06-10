'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { getProductById, products } from '@/lib/products';
import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import { useToast } from '@/lib/Toast';
import ProductGrid from '@/components/product/ProductGrid';
import {
  IconHeart,
  IconArrowLeft,
  IconPlus,
  IconMinus,
} from '@/components/ui/Icons';
import { formatPrice, cn } from '@/lib/utils';

export default function ProductoPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  const product = getProductById(id);
  const { addItem } = useCart();
  const { has, toggle: toggleFav } = useFavorites();
  const { show } = useToast();

  const [size, setSize] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSize(product.sizes[0]);
      setColor(product.colors[0].name);
      setQty(1);
    }
  }, [product]);

  if (!product) {
    notFound();
  }

  const isFav = has(product.id);
  const related = products
    .filter((p) => p.id !== product.id && p.section === product.section)
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, size, color, qty);
    show(`${product.name} añadido al carrito`);
  };

  return (
    <div className="bg-brio-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <Link
          href="/colecciones"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-brio-white/60 hover:text-brio-silver mb-8"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          Volver a colección
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* galería */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-1 gap-3">
              {product.images.map((img, i) => (
                <motion.div
                  key={img + i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative aspect-[3/4] bg-brio-gray overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* info */}
          <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
            <div className="space-y-2">
              {product.isExclusive && (
                <span className="inline-block text-[10px] uppercase tracking-[0.32em] text-brio-silver">
                  Pieza exclusiva
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl italic text-brio-white leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-xl text-brio-white">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-brio-white/40 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-6 text-sm md:text-base text-brio-white/75 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.32em] text-brio-white/60 mb-2.5">
                Color · <span className="text-brio-silver">{color}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    className={cn(
                      'h-10 w-10 rounded-full border transition-all',
                      color === c.name
                        ? 'border-brio-silver ring-2 ring-brio-silver/30'
                        : 'border-brio-line hover:border-brio-white/40'
                    )}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.32em] text-brio-white/60 mb-2.5">
                Talla
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      'min-w-[52px] h-12 px-3 text-xs uppercase tracking-wider transition-all',
                      size === s
                        ? 'bg-brio-white text-brio-black'
                        : 'border border-brio-line-strong text-brio-white/70 hover:border-brio-silver'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-stretch gap-3">
              <div className="inline-flex items-center border border-brio-line-strong">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-12 w-10 inline-flex items-center justify-center text-brio-white/80"
                  aria-label="Restar"
                >
                  <IconMinus className="w-4 h-4" />
                </button>
                <span className="min-w-[28px] text-center text-sm">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="h-12 w-10 inline-flex items-center justify-center text-brio-white/80"
                  aria-label="Sumar"
                >
                  <IconPlus className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 h-12 bg-brio-white text-brio-black text-[10px] uppercase tracking-[0.32em] hover:bg-brio-silver-soft transition-colors"
              >
                Añadir al carrito
              </button>
              <button
                type="button"
                onClick={() => {
                  const added = toggleFav(product.id);
                  show(added ? 'Guardado en favoritos' : 'Eliminado de favoritos', 'info');
                }}
                aria-label={isFav ? 'Quitar de favoritos' : 'Guardar'}
                className={cn(
                  'h-12 w-12 inline-flex items-center justify-center border transition-colors',
                  isFav
                    ? 'border-brio-silver text-brio-silver'
                    : 'border-brio-line-strong text-brio-white/70 hover:border-brio-silver hover:text-brio-silver'
                )}
              >
                <IconHeart className="w-5 h-5" filled={isFav} />
              </button>
            </div>

            {product.composition && (
              <div className="mt-8 pt-6 border-t border-brio-line space-y-2 text-sm text-brio-white/60">
                <p><span className="text-brio-white/85">Composición:</span> {product.composition}</p>
                {product.details && <p><span className="text-brio-white/85">Detalles:</span> {product.details}</p>}
              </div>
            )}

            <ul className="mt-8 pt-6 border-t border-brio-line space-y-2 text-[10px] uppercase tracking-[0.32em] text-brio-white/50">
              <li>Envío gratis en pedidos +100€</li>
              <li>Devoluciones en 30 días</li>
              <li>Calidad en cada detalle</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-2xl md:text-3xl italic text-brio-white mb-8">
              También te puede gustar
            </h2>
            <ProductGrid products={related} />
          </div>
        )}
      </div>
    </div>
  );
}
