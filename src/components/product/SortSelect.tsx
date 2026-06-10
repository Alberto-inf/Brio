'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface SortSelectProps {
  value: string;
}

export default function SortSelect({ value }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(sp.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={value}
      onChange={onChange}
      className="bg-brio-gray border border-brio-line text-[10px] uppercase tracking-[0.28em] text-brio-white px-3 py-2 focus:outline-none focus:border-brio-silver"
      aria-label="Ordenar"
    >
      <option value="newest" className="bg-brio-gray">Más recientes</option>
      <option value="price-asc" className="bg-brio-gray">Precio: menor a mayor</option>
      <option value="price-desc" className="bg-brio-gray">Precio: mayor a menor</option>
      <option value="name" className="bg-brio-gray">Nombre A-Z</option>
    </select>
  );
}
