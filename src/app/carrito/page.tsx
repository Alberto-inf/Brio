'use client';

import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IconArrowRight, IconHeart, IconClose, IconPlus, IconMinus } from '@/components/ui/Icons';
import { formatPrice, cn } from '@/lib/utils';
import { useToast } from '@/lib/Toast';
import { products } from '@/lib/products';

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { has, toggle: toggleFav } = useFavorites();
  const { show } = useToast();
  const [code, setCode] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-brio-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="inline-block h-14 w-14 rounded-full border border-brio-line mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl italic text-brio-white mb-3">
            Tu carrito está vacío
          </h1>
          <p className="text-sm text-brio-white/55 mb-8">
            Explora la colección y encuentra tu próxima prenda favorita.
          </p>
          <Link
            href="/colecciones"
            className="inline-flex items-center gap-3 bg-brio-white text-brio-black text-[10px] uppercase tracking-[0.32em] px-7 py-4 hover:bg-brio-silver-soft transition-colors"
          >
            Ver colección
            <IconArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = total >= 100 ? 0 : 4.99;
  const grand = total + shipping;

  const suggested = products
    .filter((p) => !items.some((i) => i.product.id === p.id))
    .slice(0, 4);

  return (
    <div className="bg-brio-black min-h-[60vh]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <header className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.5em] text-brio-silver mb-3 flex items-center gap-3">
            <span className="block w-8 h-px bg-brio-silver" />
            Tu selección
          </p>
          <h1 className="font-serif text-4xl md:text-5xl italic text-brio-white">
            Carrito
          </h1>
          <p className="mt-2 text-sm text-brio-white/55">
            {items.length} {items.length === 1 ? 'pieza' : 'piezas'} ·{' '}
            {items.reduce((s, i) => s + i.quantity, 0)} unidades
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <ul className="lg:col-span-2 divide-y divide-brio-line border-y border-brio-line">
            {items.map((it) => (
              <motion.li
                key={`${it.product.id}-${it.size}-${it.color}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col sm:flex-row gap-5 py-6"
              >
                <Link
                  href={`/producto/${it.product.id}`}
                  className="relative w-full sm:w-36 aspect-[3/4] bg-brio-gray overflow-hidden flex-shrink-0"
                >
                  <Image
                    src={it.product.images[0]}
                    alt={it.product.name}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base text-brio-white">{it.product.name}</h3>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-brio-white/50 mt-1">
                        {it.size} · {it.color}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(it.product.id, it.size, it.color)}
                      className="text-brio-white/40 hover:text-brio-silver transition-colors"
                      aria-label="Eliminar"
                    >
                      <IconClose className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center border border-brio-line">
                      <button
                        type="button"
                        onClick={() => updateQuantity(it.product.id, it.size, it.color, it.quantity - 1)}
                        className="h-9 w-9 inline-flex items-center justify-center text-brio-white/70 hover:text-brio-white"
                        aria-label="Restar"
                      >
                        <IconMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{it.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(it.product.id, it.size, it.color, it.quantity + 1)}
                        className="h-9 w-9 inline-flex items-center justify-center text-brio-white/70 hover:text-brio-white"
                        aria-label="Sumar"
                      >
                        <IconPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-brio-white">
                        {formatPrice(it.product.price * it.quantity)}
                      </p>
                      {it.quantity > 1 && (
                        <p className="text-[10px] uppercase tracking-[0.28em] text-brio-white/40">
                          {formatPrice(it.product.price)} / ud
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const added = toggleFav(it.product.id);
                      show(added ? 'Guardado en favoritos' : 'Eliminado de favoritos', 'info');
                    }}
                    className={cn(
                      'mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] transition-colors self-start',
                      has(it.product.id) ? 'text-brio-silver' : 'text-brio-white/50 hover:text-brio-white'
                    )}
                  >
                    <IconHeart className="w-3.5 h-3.5" filled={has(it.product.id)} />
                    {has(it.product.id) ? 'En favoritos' : 'Guardar'}
                  </button>
                </div>
              </motion.li>
            ))}
            <li className="py-4 flex items-center justify-between text-[10px] uppercase tracking-[0.28em]">
              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Vaciar el carrito?')) clearCart();
                }}
                className="text-brio-white/50 hover:text-brio-silver"
              >
                Vaciar carrito
              </button>
              <Link
                href="/colecciones"
                className="text-brio-white/50 hover:text-brio-silver"
              >
                Seguir comprando
              </Link>
            </li>
          </ul>

          <aside className="lg:col-span-1">
            <div className="border border-brio-line-strong p-6 md:p-8 bg-brio-gray lg:sticky lg:top-28 space-y-6">
              <h2 className="font-serif text-2xl italic text-brio-white">Resumen</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-brio-white/60">Subtotal</span>
                  <span className="text-brio-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brio-white/60">Envío</span>
                  <span className={shipping === 0 ? 'text-brio-silver' : 'text-brio-white'}>
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>
                {total < 100 && (
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brio-silver/80">
                    Te faltan {formatPrice(100 - total)} para envío gratis
                  </p>
                )}
                <div className="border-t border-brio-line pt-3 flex justify-between text-base">
                  <span className="text-brio-white">Total</span>
                  <span className="text-brio-white">{formatPrice(grand)}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.32em] text-brio-white/60 block mb-2">
                  Código de descuento
                </label>
                <div className="flex">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="BRIO10"
                    className="flex-1 bg-brio-black border border-brio-line px-3 py-2.5 text-xs focus:outline-none focus:border-brio-silver"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (code) show('Función de cupones disponible pronto', 'info');
                      setCode('');
                    }}
                    className="px-4 border border-l-0 border-brio-line text-[10px] uppercase tracking-[0.28em] text-brio-white/80 hover:text-brio-silver"
                  >
                    Aplicar
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="w-full h-12 bg-brio-white text-brio-black text-[10px] uppercase tracking-[0.32em] hover:bg-brio-silver-soft transition-colors"
              >
                Finalizar compra
              </button>
              <p className="text-[10px] uppercase tracking-[0.28em] text-brio-white/40 text-center">
                Pago seguro · Devoluciones 30 días
              </p>
            </div>
          </aside>
        </div>

        {suggested.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-2xl italic text-brio-white mb-8">
              Completa tu look
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {suggested.map((p) => (
                <Link
                  key={p.id}
                  href={`/producto/${p.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-brio-gray">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3 text-sm text-brio-white group-hover:text-brio-silver">
                    {p.name}
                  </h3>
                  <p className="text-sm text-brio-white/60">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
