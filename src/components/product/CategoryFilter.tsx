'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { categories, sections } from '@/lib/categories';
import { IconChevronDown } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

export default function CategoryFilter() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  const current = sp.get('cat') ?? 'todos';
  const isActive = (id: string) => current === id;

  return (
    <div className="border border-brio-line bg-brio-black md:bg-brio-black/95 backdrop-blur-sm relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="md:hidden w-full flex items-center justify-between px-5 py-4 text-[10px] uppercase tracking-[0.32em] text-brio-white/80"
        aria-expanded={open}
      >
        Filtrar por categoría
        <motion.span animate={reduce ? undefined : { rotate: open ? 180 : 0 }}>
          <IconChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <div className="hidden md:block p-4 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto">
        <FilterList isActive={isActive} pathname={pathname} />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? { height: 'auto' } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { height: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-brio-line"
          >
            <div className="p-3">
              <FilterList isActive={isActive} pathname={pathname} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterList({
  isActive,
  pathname,
}: {
  isActive: (id: string) => boolean;
  pathname: string;
}) {
  return (
    <nav aria-label="Filtros" className="flex flex-col">
      <h2 className="text-[10px] uppercase tracking-[0.32em] text-brio-white/50 mb-3 px-1">
        Categoría
      </h2>

      <div className="flex flex-col">
        <Link
          href="/colecciones"
          className={cn(
            'flex items-center justify-between px-1 py-1.5 text-xs transition-colors',
            isActive('todos')
              ? 'text-brio-silver font-medium'
              : 'text-brio-white/70 hover:text-brio-white'
          )}
        >
          <span>Todos</span>
          {isActive('todos') && <span className="text-brio-silver">•</span>}
        </Link>

        {sections.map((s) => (
          <Link
            key={s.id}
            href={s.href}
            className={cn(
              'flex items-center justify-between px-1 py-1.5 text-xs transition-colors',
              isActive(s.id)
                ? 'text-brio-silver font-medium'
                : 'text-brio-white/70 hover:text-brio-white'
            )}
          >
            <span>{s.label}</span>
            {isActive(s.id) && <span className="text-brio-silver">•</span>}
          </Link>
        ))}
      </div>

      <div className="my-3 h-px bg-brio-line" />

      <h2 className="text-[10px] uppercase tracking-[0.32em] text-brio-white/50 mb-3 px-1">
        Tipo
      </h2>

      <div className="flex flex-col">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            className={cn(
              'flex items-center justify-between px-1 py-1.5 text-xs transition-colors',
              isActive(c.id)
                ? 'text-brio-silver font-medium'
                : 'text-brio-white/60 hover:text-brio-white'
            )}
          >
            <span>{c.label}</span>
            {isActive(c.id) && <span className="text-brio-silver">•</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}
