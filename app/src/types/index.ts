// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: number;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}

// Cart Types
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_price: number;
}

// Order Types
export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: OrderStatus;
  delivery_address?: string;
  phone_number?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  order_items: OrderItem[];
  user?: User;
}

// Dashboard Stats
export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  recent_orders: Order[];
}

// Food Item (for backward compatibility)
export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}
