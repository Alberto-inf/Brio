'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { menu } from '@/lib/categories';
import { IconCart, IconUser, IconClose, IconChevronDown } from '@/components/ui/Icons';
import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import Logo from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { itemCount, openCart } = useCart();
  const { count: favCount } = useFavorites();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mm-overlay"
          className="fixed inset-0 z-[70] lg:hidden"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-brio-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.aside
            key="mm-panel"
            className="absolute right-0 top-0 h-full w-[92%] max-w-md bg-brio-black border-l border-brio-line shadow-2xl flex flex-col"
            initial={reduce ? { x: 0 } : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduce ? { x: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <header className="flex items-center justify-between px-5 sm:px-6 h-20 border-b border-brio-line">
              <Logo variant="full" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brio-line text-brio-white hover:border-brio-silver hover:text-brio-silver transition-colors"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </header>

            <nav className="flex-1 overflow-y-auto px-5 sm:px-6 py-6">
              <motion.ul
                className="space-y-1"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: 0.05 } },
                }}
              >
                {menu.map((item) => {
                  const hasChildren = !!item.children;
                  const isExpanded = expanded === item.id;
                  return (
                    <motion.li
                      key={item.id}
                      variants={{
                        hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 14 },
                        show: { opacity: 1, y: 0 },
                      }}
                    >
                      {hasChildren ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setExpanded(isExpanded ? null : item.id)}
                            aria-expanded={isExpanded}
                            className={cn(
                              'group flex w-full items-center justify-between py-3.5 text-sm font-serif italic tracking-wide transition-colors',
                              isExpanded ? 'text-brio-silver' : 'text-brio-white hover:text-brio-silver'
                            )}
                          >
                            <span>{item.label}</span>
                            <motion.span
                              animate={reduce ? undefined : { rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-brio-white/50"
                            >
                              <IconChevronDown className="w-4 h-4" />
                            </motion.span>
                          </button>
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.ul
                                initial={reduce ? { height: 'auto' } : { height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={reduce ? { height: 0 } : { height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="overflow-hidden pl-4 border-l border-brio-line ml-1"
                              >
                                {item.children!.map((child, i) => (
                                  <motion.li
                                    key={child.id}
                                    initial={reduce ? { opacity: 1 } : { opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: reduce ? 0 : 0.04 * i, duration: 0.25 }}
                                  >
                                    <Link
                                      href={child.href ?? '#'}
                                      onClick={onClose}
                                      className="flex items-center justify-between py-2.5 text-xs uppercase tracking-[0.28em] text-brio-white/70 hover:text-brio-silver transition-colors"
                                    >
                                      <span>{child.label}</span>
                                      <span className="text-brio-silver">→</span>
                                    </Link>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href ?? '#'}
                          onClick={onClose}
                          className="group flex items-center justify-between py-3.5 text-sm font-serif italic tracking-wide text-brio-white hover:text-brio-silver transition-colors"
                        >
                          <span>{item.label}</span>
                          <span className="text-brio-silver opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </Link>
                      )}
                      <div className="h-px bg-brio-line mt-1" />
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            <footer className="border-t border-brio-line p-6 space-y-3">
              <Link
                href="/favoritos"
                onClick={onClose}
                className="flex items-center justify-between py-2 text-xs uppercase tracking-[0.28em] text-brio-white/70 hover:text-brio-silver"
              >
                <span>Favoritos</span>
                {favCount > 0 && <span className="text-brio-silver">{favCount}</span>}
              </Link>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openCart();
                }}
                className="flex w-full items-center justify-between py-2 text-xs uppercase tracking-[0.28em] text-brio-white/70 hover:text-brio-silver"
              >
                <span className="flex items-center gap-2">
                  <IconCart className="w-4 h-4" /> Carrito
                </span>
                {itemCount > 0 && <span className="text-brio-silver">{itemCount}</span>}
              </button>
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-2 py-2 text-xs uppercase tracking-[0.28em] text-brio-white/70 hover:text-brio-silver"
              >
                <IconUser className="w-4 h-4" /> Iniciar sesión
              </Link>
              <div className="pt-4 mt-2 border-t border-brio-line text-[10px] uppercase tracking-[0.32em] text-brio-white/40">
                Elegancia que nace de la actitud
              </div>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
