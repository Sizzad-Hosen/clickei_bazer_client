'use client';

import { useState, useMemo } from 'react';
import { useGetAllProductsQuery } from '@/redux/features/Products/productApi';
import { Product } from '@/types/products';
import Sidebar from '../shared/Sidebar';
import ProductCard from '../Products/ProductCard';
import WishlistHome from './HomeWishList';
import Spinner from '../Spinner';
import CartDrawer from '../Carts/CartDrawer';

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isLoading, error } = useGetAllProductsQuery({});

  const [cartOpen, setCartOpen] = useState(false);

  const products: Product[] = useMemo(
    () => (Array.isArray(data?.data?.data) ? data.data.data : []),
    [data]
  );

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const groupedProducts = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    products
      .filter((p) => p && p._id) // ✅ filter out null or missing _id
      .forEach((product) => {
        const category = product.category || 'Uncategorized';
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(product);
      });
    return grouped;
  }, [products]);

  const categories = Object.keys(groupedProducts);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white gap-6 overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r shadow-sm md:block">
        <Sidebar onSelectSubcategory={setSelectedCategory} />
      </div>

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-6">
        <h2 className="text-2xl font-bold text-center md:text-left mb-6">
          Explore Products by Category
        </h2>

        {isLoading && <Spinner />}
        {error && (
          <p className="text-center text-red-500">Failed to load products.</p>
        )}
        {!isLoading && !error && categories.length === 0 && (
          <p className="text-center text-gray-500">No products available.</p>
        )}

        {!isLoading &&
          !error &&
          categories.length > 0 &&
          categories.map((category) => {
            if (selectedCategory && selectedCategory !== category) return null;
            return (
              <section key={category} className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold">{category}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {groupedProducts[category].map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onOpenCart={openCart}
                    />
                  ))}
                </div>
              </section>
            );
          })}

        <WishlistHome />
      </main>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </div>
  );
};
