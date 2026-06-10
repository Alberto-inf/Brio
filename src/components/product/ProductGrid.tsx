'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';

interface ProductGridProps {
  products: Product[];
  emptyLabel?: string;
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({
  products,
  emptyLabel = 'No se encontraron productos.',
  columns = 4,
}: ProductGridProps) {
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);

  const cols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif italic text-2xl text-brio-white/60">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid gap-4 md:gap-6 ${cols}`}>
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            onQuickView={setQuickProduct}
            index={i}
          />
        ))}
      </div>
      <QuickViewModal product={quickProduct} onClose={() => setQuickProduct(null)} />
    </>
  );
}
