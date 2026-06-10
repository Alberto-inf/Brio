'use client';

import { useCart } from '@/lib/CartContext';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IconClose, IconCart, IconArrowRight } from '@/components/ui/Icons';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, total, itemCount } = useCart();
  const reduce = useReducedMotion();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    router.push('/carrito');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[110]"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-brio-black/80 backdrop-blur-sm"
            onClick={closeCart}
          />

          <motion.aside
            initial={reduce ? { x: 0 } : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduce ? { x: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="absolute right-0 top-0 h-full w-[92%] max-w-md bg-brio-gray border-l border-brio-line-strong shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
          >
            <header className="flex items-center justify-between px-6 h-16 border-b border-brio-line">
              <div className="flex items-center gap-3">
                <IconCart className="w-4 h-4 text-brio-silver" />
                <span className="text-[10px] uppercase tracking-[0.32em] text-brio-silver">
                  Tu carrito
                </span>
                {itemCount > 0 && (
                  <span className="text-[10px] uppercase tracking-[0.28em] text-brio-white/50">
                    · {itemCount} {itemCount === 1 ? 'pieza' : 'piezas'}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Cerrar"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brio-line text-brio-white/80 hover:border-brio-silver hover:text-brio-white transition-colors"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16">
                  <span className="block h-12 w-12 rounded-full border border-brio-line mb-4" />
                  <p className="font-serif italic text-2xl text-brio-white/80 mb-2">
                    Tu carrito está vacío
                  </p>
                  <p className="text-sm text-brio-white/50 max-w-xs">
                    Explora la colección y encuentra tu próxima prenda favorita.
                  </p>
                  <Link
                    href="/colecciones"
                    onClick={closeCart}
                    className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-brio-silver hover:text-brio-white"
                  >
                    Ver colección <IconArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-brio-line">
                  {items.map((it) => (
                    <li
                      key={`${it.product.id}-${it.size}-${it.color}`}
                      className="flex gap-4 p-5"
                    >
                      <div className="relative h-28 w-24 bg-brio-black flex-shrink-0 overflow-hidden">
                        <Image
                          src={it.product.images[0]}
                          alt={it.product.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-sm text-brio-white">{it.product.name}</h3>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-brio-white/50 mt-0.5">
                          {it.size} · {it.color}
                        </p>
                        <p className="text-sm text-brio-white mt-1">{formatPrice(it.product.price)}</p>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="inline-flex items-center border border-brio-line">
                            <button
                              type="button"
                              onClick={() => updateQuantity(it.product.id, it.size, it.color, it.quantity - 1)}
                              className="h-8 w-8 inline-flex items-center justify-center text-brio-white/70 hover:text-brio-white"
                              aria-label="Restar"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-xs">{it.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(it.product.id, it.size, it.color, it.quantity + 1)}
                              className="h-8 w-8 inline-flex items-center justify-center text-brio-white/70 hover:text-brio-white"
                              aria-label="Sumar"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(it.product.id, it.size, it.color)}
                            className="text-[10px] uppercase tracking-[0.28em] text-brio-white/50 hover:text-brio-silver"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-brio-line p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-brio-white/60">Subtotal</span>
                  <span className="text-brio-white">{formatPrice(total)}</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-brio-white/40">
                  Envío calculado en el siguiente paso
                </p>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 bg-brio-white text-brio-black text-[10px] uppercase tracking-[0.32em] hover:bg-brio-silver-soft transition-colors"
                >
                  Finalizar compra <IconArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full text-[10px] uppercase tracking-[0.32em] text-brio-white/50 hover:text-brio-white"
                >
                  Seguir comprando
                </button>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
