import { Suspense } from 'react';
import { getProductsByCategory } from '@/lib/products';
import { getCategoryLabel } from '@/lib/categories';
import ProductGrid from '@/components/product/ProductGrid';
import CategoryFilter from '@/components/product/CategoryFilter';
import SortSelect from '@/components/product/SortSelect';

interface SearchParamsShape {
  cat?: string;
  sort?: string;
}

export default async function ColeccionesPage(props: {
  searchParams: Promise<SearchParamsShape>;
}) {
  const sp = await props.searchParams;
  const cat = sp.cat ?? 'todos';
  const sort = sp.sort ?? 'newest';

  let products = getProductsByCategory(cat);

  if (sort === 'price-asc') products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') products = [...products].sort((a, b) => b.price - a.price);
  else if (sort === 'name') products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  else
    products = [...products].sort(
      (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
    );

  const title =
    cat === 'todos'
      ? 'Colección completa'
      : cat === 'parte-superior'
        ? 'Parte Superior'
        : cat === 'parte-inferior'
          ? 'Parte Inferior'
          : cat === 'exclusivo'
            ? 'Exclusivos'
            : cat === 'outlet'
              ? 'Outlet'
              : cat === 'total-look'
                ? 'Total Look'
                : getCategoryLabel(cat as never);

  return (
    <div className="bg-brio-black min-h-[60vh]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <header className="mb-10 text-center md:text-left">
          <p className="text-[10px] uppercase tracking-[0.5em] text-brio-silver mb-3 flex items-center gap-3 md:justify-start justify-center">
            <span className="block w-8 h-px bg-brio-silver" />
            Colección
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-brio-white leading-tight">
            {title}
          </h1>
          <p className="mt-3 text-sm text-brio-white/55 max-w-md">
            {products.length} {products.length === 1 ? 'pieza' : 'piezas'} disponibles.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] md:items-start gap-6 md:gap-10">
          <aside className="md:sticky md:top-28 md:z-30 md:self-start md:max-h-[calc(100vh-7rem)]">
            <Suspense fallback={<div className="h-40 border border-brio-line animate-pulse" />}>
              <CategoryFilter />
            </Suspense>
          </aside>

          <div className="min-w-0">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] uppercase tracking-[0.32em] text-brio-white/50">
                Vista
              </span>
              <Suspense
                fallback={
                  <div className="h-9 w-48 border border-brio-line bg-brio-gray animate-pulse" />
                }
              >
                <SortSelect value={sort} />
              </Suspense>
            </div>

            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
