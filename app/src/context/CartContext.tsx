import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cartAPI } from '@/services/api';
import { useAuth } from './AuthContext';
import type { CartItem, Product } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  justAdded: boolean;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart from backend when authenticated
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartAPI.getCart();
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setIsLoading(true);
      await cartAPI.addItem({ product_id: product.id, quantity: 1 });
      await refreshCart();
      
      // Trigger badge pulse animation
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 300);
      
      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to add item';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, refreshCart]);

  const removeItem = useCallback(async (itemId: number) => {
    try {
      setIsLoading(true);
      await cartAPI.removeItem(itemId);
      await refreshCart();
      toast.success('Item removed from cart');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to remove item';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshCart]);

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      setIsLoading(true);
      await cartAPI.updateItem(itemId, { quantity });
      await refreshCart();
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to update quantity';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshCart, removeItem]);

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      await cartAPI.clearCart();
      setItems([]);
      toast.success('Cart cleared');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to clear cart';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refreshCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        justAdded,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
