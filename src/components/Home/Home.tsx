'use client';

import { useGetAllProductsQuery } from '@/redux/features/Products/productApi';
import { Product } from '@/types/products';
import ProductCard from '../Products/ProductCard';
import { useState, useMemo } from 'react';
import Sidebar from '../shared/Sidebar';

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data, isLoading, error } = useGetAllProductsQuery(undefined);
  
  const products: Product[] = useMemo(() => {
    return data?.data?.data || [];
  }, [data]);

  // Group products by category
  const groupedProducts = useMemo(() => {
    const grouped: { [key: string]: Product[] } = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [products]);

  const categories = Object.keys(groupedProducts);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar onSelectSubcategory={(id) => setSelectedCategory(id)} />

        {/* Main */}
        <main className="flex-1 p-4 md:p-6 space-y-10 overflow-x-hidden">
          <h2 className="text-2xl font-bold mb-6 text-center">Explore Products by Category</h2>

          {/* Loading */}
          {isLoading && <p className="text-gray-600 text-center">Loading products...</p>}

          {/* Error */}
          {error && <p className="text-red-500 text-center">Failed to load products.</p>}

          {/* Category-wise Products */}
          {!isLoading && !error && categories.length > 0 && categories.map((category) => {
            if (selectedCategory && selectedCategory !== category) return null;

            return (
              <section key={category}>
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupedProducts[category].map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* No Products */}
          {!isLoading && categories.length === 0 && (
            <p className="text-center text-gray-500">No products available.</p>
          )}
        </main>
      </div>
    </div>
  );
};
