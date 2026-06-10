export type ProductCategory =
  | 'blazer'
  | 'camisa'
  | 'top'
  | 'pantalon'
  | 'falda'
  | 'total-look'
  | 'exclusivo'
  | 'outlet';

export type ProductSection =
  | 'parte-superior'
  | 'parte-inferior'
  | 'total-look'
  | 'exclusivos'
  | 'outlet';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  section: ProductSection;
  description: string;
  details?: string;
  composition?: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  isNew?: boolean;
  isExclusive?: boolean;
  isOutlet?: boolean;
  stock?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  children?: MenuItem[];
}

export interface ToastMessage {
  id: string;
  message: string;
  variant?: 'success' | 'info' | 'error';
}
