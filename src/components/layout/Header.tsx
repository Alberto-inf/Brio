'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import IconButton from '@/components/ui/IconButton';
import { IconCart, IconUser, IconHeart, IconSearch } from '@/components/ui/Icons';
import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import { menu } from '@/lib/categories';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { itemCount, openCart } = useCart();
  const { count: favCount } = useFavorites();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-brio-black/90 backdrop-blur-xl border-b border-brio-line'
            : 'bg-gradient-to-b from-brio-black via-brio-black/70 to-transparent'
        )}
      >
        {/* Fila 1: Brío (izquierda) + acciones (derecha) */}
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-2">
            {/* Izquierda: solo el wordmark Brío, grande y legible */}
            <div className="flex items-center min-w-0">
              <Logo
                variant="full"
                priority
                className="h-9 sm:h-10 md:h-12 w-auto"
              />
            </div>

            {/* Derecha: acciones */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-3 min-w-0">
              <IconButton
                label="Buscar"
                className="hidden md:inline-flex"
                href="/colecciones"
              >
                <IconSearch className="w-4 h-4" />
              </IconButton>
              <Link
                href="/favoritos"
                aria-label="Favoritos"
                className="relative hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-brio-line text-brio-white/80 hover:border-brio-silver hover:text-brio-white transition-colors"
              >
                <IconHeart className="w-4 h-4" />
                {favCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brio-silver text-brio-black text-[10px] font-semibold flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </Link>
              <IconButton label="Iniciar sesión" className="hidden lg:inline-flex">
                <IconUser className="w-4 h-4" />
              </IconButton>
              <IconButton
                label="Carrito"
                badge={itemCount}
                onClick={openCart}
                variant={itemCount > 0 ? 'filled' : 'default'}
              >
                <IconCart className="w-4 h-4" />
              </IconButton>

              <button
                type="button"
                aria-label="Abrir menú"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
                className="lg:hidden relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-brio-line text-brio-white hover:border-brio-silver hover:text-brio-silver transition-colors overflow-hidden"
              >
                <BurgerIcon open={mobileOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* Fila 2: navegación principal desktop */}
        <nav
          aria-label="Navegación principal"
          className="hidden lg:block border-t border-brio-line"
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center gap-1">
              {menu.map((item) => {
                const hasChildren = !!item.children;
                const isOpen = activeMenu === item.id;
                const isActive =
                  item.href === pathname ||
                  (item.href && pathname.startsWith(item.href.split('?')[0]) && item.href !== '/');
                return (
                  <li
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => hasChildren && setActiveMenu(item.id)}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setActiveMenu(isOpen ? null : item.id)}
                        className={cn(
                          'group flex items-center gap-1.5 px-5 py-4 text-[10px] uppercase tracking-[0.28em] transition-colors',
                          isOpen ? 'text-brio-silver' : 'text-brio-white/70 hover:text-brio-white'
                        )}
                      >
                        <span className="relative">
                          {item.label}
                          <span
                            className={cn(
                              'absolute -bottom-1 left-0 h-px bg-brio-silver transition-all duration-500',
                              isOpen ? 'w-full' : 'w-0 group-hover:w-full'
                            )}
                          />
                        </span>
                        <motion.svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="w-3 h-3"
                          animate={reduce ? undefined : { rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </motion.svg>
                      </button>
                    ) : (
                      <Link
                        href={item.href ?? '#'}
                        className={cn(
                          'group relative flex items-center px-5 py-4 text-[10px] uppercase tracking-[0.28em] transition-colors',
                          isActive ? 'text-brio-silver' : 'text-brio-white/70 hover:text-brio-white'
                        )}
                      >
                        {item.label}
                        <span
                          className={cn(
                            'absolute left-5 right-5 -bottom-px h-px bg-brio-silver transition-transform duration-500 origin-left',
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          )}
                        />
                      </Link>
                    )}

                    <AnimatePresence>
                      {hasChildren && isOpen && (
                        <motion.div
                          initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-1"
                        >
                          <div className="min-w-[220px] border border-brio-line bg-brio-black/95 backdrop-blur-xl shadow-2xl py-2">
                            {item.children!.map((child, i) => (
                              <motion.div
                                key={child.id}
                                initial={reduce ? { opacity: 1 } : { opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: reduce ? 0 : 0.04 * i, duration: 0.25 }}
                              >
                                <Link
                                  href={child.href ?? '#'}
                                  className="group flex items-center justify-between px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-brio-white/70 hover:text-brio-white hover:bg-brio-gray-light/40 transition-colors"
                                >
                                  <span>{child.label}</span>
                                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brio-silver">
                                    →
                                  </span>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      {/* spacer para que el contenido no quede tapado por header fijo */}
      <div className="h-16 md:h-20" aria-hidden />
      <div className="hidden lg:block h-[57px]" aria-hidden />

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-5">
      <motion.span
        className="absolute left-0 right-0 h-px bg-current"
        initial={false}
        animate={{ top: open ? '10px' : '4px', rotate: open ? 45 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      <motion.span
        className="absolute left-0 right-0 h-px bg-current"
        style={{ top: '10px' }}
        initial={false}
        animate={{ opacity: open ? 0 : 1, width: open ? '0%' : '70%' }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute left-0 right-0 h-px bg-current"
        initial={false}
        animate={{ top: open ? '10px' : '16px', rotate: open ? -45 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </span>
  );
}
