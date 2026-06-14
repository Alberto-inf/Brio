import type { Product } from './types';

export const products: Product[] = [
  {
    id: 'blazer-01',
    name: 'Blazer Noir Essential',
    price: 219,
    category: 'blazer',
    section: 'parte-superior',
    description:
      'Blazer entallado en tejido premium con caída impecable. Corte atemporal que eleva cualquier look, de oficina a cóctel.',
    details: 'Forro interior de satén. Bolsillos funcionales en delantero. Cierre de un botón con detalle metálico en plata cepillada.',
    composition: '78% viscosa, 18% lana, 4% elastano',
    images: ['/images/products/p04.jpeg', '/images/products/p02.jpeg', '/images/products/p08.jpeg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
    isNew: true,
    isExclusive: true,
  },
  {
    id: 'camisa-01',
    name: 'Camisa Seda Lunar',
    price: 159,
    category: 'camisa',
    section: 'parte-superior',
    description:
      'Camisa fluida de seda con cuelloSmoking y botones forrados. Un básico lujoso para looks minimalistas.',
    details: 'Cuello smoking. Manga larga con puño doble. Corte relajado.',
    composition: '100% seda natural',
    images: ['/images/products/p03.jpeg', '/images/products/p13.jpeg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
  },
  {
    id: 'top-01',
    name: 'Top Asimétrico Brío',
    price: 99,
    originalPrice: 129,
    category: 'top',
    section: 'parte-superior',
    description:
      'Top asimétrico con un hombro al descubierto. Escote statement que define la silueta.',
    details: 'Tela con elastano. Acabado mate. Forro interior.',
    composition: '92% poliamida, 8% elastano',
    images: ['/images/products/p07.jpeg', '/images/products/p14.jpeg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
    isOutlet: true,
  },
  {
    id: 'pantalon-01',
    name: 'Pantalón Wide Leg Elegancia',
    price: 169,
    category: 'pantalon',
    section: 'parte-inferior',
    description:
      'Pantalón de pierna ancha con tiro alto. Cae con una fluidez espectacular y alarga la silueta.',
    details: 'Cintura alta. Pliegue delantero. Bolsillos laterales ocultos.',
    composition: '70% viscosa, 27% poliamida, 3% elastano',
    images: ['/images/products/p10.jpeg', '/images/products/p16.jpeg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
    isNew: true,
  },
  {
    id: 'falda-01',
    name: 'Falda Midi Drapeada',
    price: 139,
    category: 'falda',
    section: 'parte-inferior',
    description:
      'Falda midi con drapeado lateral. Movimiento elegante con cada paso.',
    details: 'Cintura con costura interna. Forro de viscosa. Cierre lateral invisible.',
    composition: '95% viscosa, 5% elastano',
    images: ['/images/products/p09.jpeg', '/images/products/p15.jpeg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
  },
  {
    id: 'total-01',
    name: 'Conjunto Elegancia Total',
    price: 289,
    originalPrice: 358,
    category: 'top',
    section: 'total-look',
    description:
      'Conjunto de top y pantalón diseñados para conjuntarse a la perfección. Una sola decisión, look completo.',
    details: 'Top crop con manga larga. Pantalón wide leg a juego. Tela de doble cara.',
    composition: 'Premium italiana',
    images: ['/images/modelo2.avif', '/images/modelo3.jpg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
    isNew: true,
  },
  {
    id: 'total-02',
    name: 'Look Blazer & Falda',
    price: 319,
    category: 'blazer',
    section: 'total-look',
    description:
      'Blazer entallado con falda midi al tobillo. Equilibrio entre poder y feminidad.',
    details: 'Conjunto de dos piezas. Misma tela, caída sincronizada.',
    composition: '78% viscosa, 18% lana, 4% elastano',
    images: ['/images/modelo3.jpg', '/images/modelo2.avif'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
    isExclusive: true,
  },
  {
    id: 'blazer-02',
    name: 'Blazer Oversize Statement',
    price: 259,
    originalPrice: 309,
    category: 'blazer',
    section: 'parte-superior',
    description:
      'Blazer oversize con hombreras estructuradas. Largo a la cadera, ideal para layering.',
    details: 'Corte cuadrado. Mangas anchas. Botones forrados.',
    composition: 'Lana fría premium',
    images: ['/images/products/p05.jpeg', '/images/products/p19.jpeg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
    isOutlet: true,
  },
  {
    id: 'camisa-02',
    name: 'Camisa Minimal Escote V',
    price: 119,
    category: 'camisa',
    section: 'parte-superior',
    description:
      'Camisa con escote en V y manga francesa. Versátil, ligera y muy favorecedora.',
    details: 'Escote en V. Manga 3/4. Corte recto.',
    composition: '100% viscosa',
    images: ['/images/products/p06.jpeg', '/images/products/p13.jpeg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
  },
  {
    id: 'top-02',
    name: 'Top Drapeado Atelier',
    price: 149,
    category: 'top',
    section: 'parte-superior',
    description:
      'Top con drapeado frontal. Escote elevado y manga larga. Sofisticación sin esfuerzo.',
    details: 'Cruzado en escote. Tela con caída. Forro interior.',
    composition: '92% viscosa, 8% elastano',
    images: ['/images/products/p01.jpeg', '/images/products/p14.jpeg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
    isNew: true,
    isExclusive: true,
  },
  {
    id: 'falda-02',
    name: 'Falda Lápiz Sensual',
    price: 159,
    category: 'falda',
    section: 'parte-inferior',
    description:
      'Falda lápiz de tiro medio. Largo midi, corte que esculpe sin oprimir.',
    details: 'Tiro medio. Costura trasera. Cremallera invisible.',
    composition: '68% viscosa, 28% poliamida, 4% elastano',
    images: ['/images/products/p15.jpeg', '/images/products/p19.jpeg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
  },
  {
    id: 'pantalon-02',
    name: 'Pantalón Slim Cigarette',
    price: 149,
    originalPrice: 189,
    category: 'pantalon',
    section: 'parte-inferior',
    description:
      'Pantalón slim tipo cigarette. Largo al tobillo para enseñar el zapato.',
    details: 'Corte entallado. Pretina alta. Bolsillos oblicuos.',
    composition: '70% viscosa, 27% poliamida, 3% elastano',
    images: ['/images/products/p16.jpeg', '/images/products/p18.jpeg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Negro', hex: '#0a0a0a' }],
    isOutlet: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (!category || category === 'todos') return products;
  return products.filter((p) => p.category === category || p.section === category);
}

export function getProductsBySection(section: string): Product[] {
  return products.filter((p) => p.section === section);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getExclusives(): Product[] {
  return products.filter((p) => p.isExclusive);
}

export function getOutlet(): Product[] {
  return products.filter((p) => p.isOutlet);
}

export function getFeatured(): Product[] {
  return products.slice(0, 8);
}
