'use client';
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Selection } from '@/types/CustomBazar';

interface CartContextType {
  selections: Record<string, Selection[]>;
  setSelections: React.Dispatch<React.SetStateAction<Record<string, Selection[]>>>;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [selections, setSelections] = useState<Record<string, Selection[]>>({});

  const totalPrice = useMemo(() => {
    return Object.values(selections).flat().reduce((acc, item) => {
      if (!item.selectedSub) return acc;
      return acc + (item.selectedSub.pricePerUnit || 0) * (item.quantity || 0);
    }, 0);
  }, [selections]);

  return (
    <CartContext.Provider value={{ selections, setSelections, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
