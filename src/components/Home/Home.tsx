'use client';

import { useState, useMemo } from 'react';
import { useGetAllProductsQuery } from '@/redux/features/Products/productApi';
import { Product } from '@/types/products';
import Sidebar from '../shared/Sidebar';
import ProductCard from '../Products/ProductCard';
import WishlistHome from './HomeWishList';
import Spinner from '../Spinner';

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data, isLoading, error } = useGetAllProductsQuery();

  const products: Product[] = useMemo(() => data?.data?.data || [], [data]);

  const groupedProducts = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    products.forEach((product) => {
      const category = product.category || 'Uncategorized';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(product);
    });
    return grouped;
  }, [products]);

  const categories = Object.keys(groupedProducts);

  return (
    <div className="min-h-screen flex bg-white gap-6 overflow-hidden">

   
      <div className="w-full md:w-64 border-r shadow-sm">
        <Sidebar onSelectSubcategory={setSelectedCategory} />
      </div>

    
      <main className="flex-1 mb-6 overflow-y-auto h-screen p-4 md:p-6 ps-6">

   
        <h2 className="text-2xl font-bold text-center mb-6">
          Explore Products by Category
        </h2>

      
        {isLoading && <Spinner></Spinner>}
        {error && <p className="text-center text-red-500">Failed to load products.</p>}
        {!isLoading && !error && categories.length === 0 && (
          <p className="text-center text-gray-500">No products available.</p>
        )}

      
        {!isLoading &&
          !error &&
          categories.length > 0 &&
          categories.map((category) => {
            if (selectedCategory && selectedCategory !== category) return null;
            return (
              <section key={category} className="space-y-4">
                <h3 className="text-xl font-semibold">{category}</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {groupedProducts[category].map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

              </section>
            );
          })}

          
          {/* Wishlist shown under each category */}
                <WishlistHome />
      </main>
      
    </div>
  );
};
