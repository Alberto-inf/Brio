export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  updated_at: string | null;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total_cents: number;
  currency: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  unit_price_cents: number;
  quantity: number;
  size: string | null;
  color: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string | null;
          postal_code?: string | null;
          country?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Profile>;
      };
      orders: {
        Row: Order;
        Insert: {
          id?: string;
          user_id: string;
          status?: OrderStatus;
          total_cents?: number;
          currency?: string;
          created_at?: string;
        };
        Update: Partial<Order>;
      };
      order_items: {
        Row: OrderItem;
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          name: string;
          unit_price_cents: number;
          quantity: number;
          size?: string | null;
          color?: string | null;
        };
        Update: Partial<OrderItem>;
      };
    };
  };
}
