'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getNewArrivals, getExclusives, getOutlet } from '@/lib/products';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/product/QuickViewModal';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

type Tab = 'nuevo' | 'exclusivos' | 'outlet';

export default function Featured() {
  const [tab, setTab] = useState<Tab>('nuevo');
  const [quick, setQuick] = useState<Product | null>(null);

  const items =
    tab === 'nuevo' ? getNewArrivals() : tab === 'exclusivos' ? getExclusives() : getOutlet();

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-brio-silver mb-3 flex items-center gap-3">
            <span className="block w-8 h-px bg-brio-silver" />
            Selección Brío
          </p>
          <h2 className="font-serif text-4xl md:text-5xl italic text-brio-white leading-tight">
            Lo destacado
          </h2>
        </div>
        <div className="flex items-center gap-1 border border-brio-line p-1 self-start">
          {(['nuevo', 'exclusivos', 'outlet'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'relative px-4 py-2 text-[10px] uppercase tracking-[0.28em] transition-colors',
                tab === t ? 'text-brio-black' : 'text-brio-white/70 hover:text-brio-white'
              )}
            >
              {tab === t && (
                <motion.span
                  layoutId="featured-tab"
                  className="absolute inset-0 bg-brio-silver"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">
                {t === 'nuevo' ? 'Nuevo' : t === 'exclusivos' ? 'Exclusivos' : 'Outlet'}
              </span>
            </button>
          ))}
        </div>
      </header>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} onQuickView={setQuick} index={i} />
        ))}
      </motion.div>

      <QuickViewModal product={quick} onClose={() => setQuick(null)} />
    </section>
  );
}
