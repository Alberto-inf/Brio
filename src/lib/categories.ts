import type { MenuItem, ProductCategory, ProductSection } from './types';

export interface CategoryInfo {
  id: ProductCategory;
  label: string;
  href: string;
}

export interface SectionInfo {
  id: ProductSection;
  label: string;
  href: string;
  description: string;
  image: string;
}

export const sections: SectionInfo[] = [
  {
    id: 'parte-superior',
    label: 'Parte Superior',
    href: '/colecciones?cat=parte-superior',
    description: 'Blazers, camisas y tops que definen la silueta.',
    image: '/images/products/p04.jpeg',
  },
  {
    id: 'parte-inferior',
    label: 'Parte Inferior',
    href: '/colecciones?cat=parte-inferior',
    description: 'Pantalones y faldas con caída impecable.',
    image: '/images/products/p05.jpeg',
  },
  {
    id: 'total-look',
    label: 'Total Look',
    href: '/colecciones?cat=total-look',
    description: 'Conjuntos completos listos para brillar.',
    image: '/images/products/p11.jpeg',
  },
  {
    id: 'exclusivos',
    label: 'Exclusivos',
    href: '/colecciones?cat=exclusivo',
    description: 'Piezas únicas, ediciones limitadas.',
    image: '/images/products/p12.jpeg',
  },
  {
    id: 'outlet',
    label: 'Outlet',
    href: '/colecciones?cat=outlet',
    description: 'Selección con precio especial.',
    image: '/images/products/p06.jpeg',
  },
];

export const categories: CategoryInfo[] = [
  { id: 'blazer', label: 'Blazer', href: '/colecciones?cat=blazer' },
  { id: 'camisa', label: 'Camisa', href: '/colecciones?cat=camisa' },
  { id: 'top', label: 'Top', href: '/colecciones?cat=top' },
  { id: 'pantalon', label: 'Pantalones', href: '/colecciones?cat=pantalon' },
  { id: 'falda', label: 'Falda', href: '/colecciones?cat=falda' },
];

export const menu: MenuItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'parte-superior',
    label: 'Parte Superior',
    children: [
      { id: 'blazer', label: 'Blazer', href: '/colecciones?cat=blazer' },
      { id: 'camisa', label: 'Camisa', href: '/colecciones?cat=camisa' },
      { id: 'top', label: 'Top', href: '/colecciones?cat=top' },
    ],
  },
  {
    id: 'parte-inferior',
    label: 'Parte Inferior',
    children: [
      { id: 'pantalon', label: 'Pantalones', href: '/colecciones?cat=pantalon' },
      { id: 'falda', label: 'Falda', href: '/colecciones?cat=falda' },
    ],
  },
  { id: 'total-look', label: 'Total Look', href: '/colecciones?cat=total-look' },
  { id: 'exclusivos', label: 'Exclusivos', href: '/colecciones?cat=exclusivo' },
  { id: 'outlet', label: 'Outlet', href: '/colecciones?cat=outlet' },
];

export function getCategoryLabel(id: ProductCategory): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}
