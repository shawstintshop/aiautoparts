'use client';

import React, { createContext, useContext, useState } from 'react';
import { CartItem, PartResult, DeliveryOption } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (part: PartResult, delivery: DeliveryOption) => void;
  removeItem: (partNumber: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (part: PartResult, delivery: DeliveryOption) => {
    setItems(prev => {
      const existing = prev.find(i => i.part.partNumber === part.partNumber);
      if (existing) return prev;
      return [...prev, { part, quantity: 1, selectedDelivery: delivery }];
    });
  };

  const removeItem = (partNumber: string) => {
    setItems(prev => prev.filter(i => i.part.partNumber !== partNumber));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) =>
    sum + item.part.price + item.selectedDelivery.price, 0
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount: items.length }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
