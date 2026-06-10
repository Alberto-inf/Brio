'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import { useToast } from '@/lib/Toast';
import { IconClose, IconHeart, IconPlus, IconMinus, IconArrowRight } from '@/components/ui/Icons';
import { formatPrice, cn } from '@/lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [size, setSize] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { addItem } = useCart();
  const { has, toggle: toggleFav } = useFavorites();
  const { show } = useToast();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0]);
    setColor(product.colors[0].name);
    setQty(1);
    setActiveImage(0);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [product, onClose]);

  const isFav = product ? has(product.id) : false;
  const isOutOfStock = product?.stock === 0;

  const handleAdd = () => {
    if (!product) return;
    addItem(product, size, color, qty);
    show(`${product.name} añadido al carrito`);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="qv-overlay"
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute inset-0 bg-brio-black/85 backdrop-blur-md"
          />

          <motion.div
            key="qv-panel"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="relative w-full md:w-[min(960px,92vw)] max-h-[92dvh] bg-brio-gray border border-brio-line-strong overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Imágenes */}
            <div className="md:w-1/2 relative bg-brio-black flex">
              <div className="relative w-full aspect-[3/4] md:aspect-auto md:min-h-[600px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[activeImage]}
                      alt={product.name}
                      fill
                      sizes="(min-width: 768px) 480px, 100vw"
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {product.images.length > 1 && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
                  {product.images.map((img, i) => (
                    <button
                      key={img + i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      aria-label={`Imagen ${i + 1}`}
                      className={cn(
                        'relative h-12 w-12 overflow-hidden border transition-all',
                        activeImage === i
                          ? 'border-brio-silver'
                          : 'border-brio-line hover:border-brio-white/40'
                      )}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {product.isExclusive && (
                    <span className="inline-block text-[9px] uppercase tracking-[0.32em] text-brio-silver mb-2">
                      Pieza exclusiva
                    </span>
                  )}
                  <h2 className="font-serif text-2xl md:text-3xl italic text-brio-white text-balance">
                    {product.name}
                  </h2>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-lg text-brio-white">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-brio-white/40 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brio-line text-brio-white/80 hover:border-brio-silver hover:text-brio-white transition-colors flex-shrink-0"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              </div>

              <p className="mt-5 text-sm text-brio-white/70 leading-relaxed">
                {product.description}
              </p>

              {/* Colores */}
              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-[0.32em] text-brio-white/60 mb-2.5">
                  Color · <span className="text-brio-silver">{color}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      title={c.name}
                      aria-label={c.name}
                      className={cn(
                        'h-9 w-9 rounded-full border transition-all',
                        color === c.name
                          ? 'border-brio-silver ring-2 ring-brio-silver/30'
                          : 'border-brio-line hover:border-brio-white/40'
                      )}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Tallas */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-brio-white/60">
                    Talla
                  </p>
                  <Link
                    href={`/producto/${product.id}`}
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-[0.28em] text-brio-silver hover:underline"
                  >
                    Guía de tallas
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={cn(
                        'min-w-[48px] h-10 px-3 text-xs uppercase tracking-wider transition-all',
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

              {/* Cantidad + Add */}
              <div className="mt-6 flex items-stretch gap-3">
                <div className="inline-flex items-center border border-brio-line-strong">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Restar"
                    className="h-12 w-10 inline-flex items-center justify-center text-brio-white/80 hover:text-brio-white"
                  >
                    <IconMinus className="w-4 h-4" />
                  </button>
                  <span className="min-w-[28px] text-center text-sm">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Sumar"
                    className="h-12 w-10 inline-flex items-center justify-center text-brio-white/80 hover:text-brio-white"
                  >
                    <IconPlus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-2 h-12 text-[10px] uppercase tracking-[0.32em] font-medium transition-colors',
                    isOutOfStock
                      ? 'bg-brio-gray-mid text-brio-white/40 cursor-not-allowed'
                      : 'bg-brio-white text-brio-black hover:bg-brio-silver-soft'
                  )}
                >
                  {isOutOfStock ? 'Agotado' : 'Añadir al carrito'}
                </button>
              </div>

              {/* Favorito + Ver detalle */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const added = toggleFav(product.id);
                    show(added ? 'Guardado en favoritos' : 'Eliminado de favoritos', 'info');
                  }}
                  className={cn(
                    'inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] transition-colors',
                    isFav ? 'text-brio-silver' : 'text-brio-white/60 hover:text-brio-white'
                  )}
                >
                  <IconHeart className="w-4 h-4" filled={isFav} />
                  {isFav ? 'En tus favoritos' : 'Guardar'}
                </button>
                <Link
                  href={`/producto/${product.id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] text-brio-silver hover:text-brio-white"
                >
                  Ver detalle completo <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {product.composition && (
                <div className="mt-6 pt-6 border-t border-brio-line text-[11px] text-brio-white/50 leading-relaxed space-y-1">
                  <p><span className="text-brio-white/70">Composición:</span> {product.composition}</p>
                  {product.details && <p><span className="text-brio-white/70">Detalles:</span> {product.details}</p>}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
