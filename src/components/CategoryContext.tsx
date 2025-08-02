'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

type CategoryContextType = {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategory must be used within CategoryProvider");
  return context;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
