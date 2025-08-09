'use client';

import { useState, useMemo } from 'react';
import { useGetAllProductsQuery } from '@/redux/features/Products/productApi';
import { Product } from '@/types/products';
import Sidebar from '../shared/Sidebar';
import ProductCard from '../Products/ProductCard';
import WishlistHome from './HomeWishList';
import Spinner from '../Spinner';
import CartDrawer from '../Carts/CartDrawer';
import BannerSlider from './Banner';
import ProductsBySubcategoryPage from './SubCategoryWiseProducts';

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isLoading, error } = useGetAllProductsQuery({});

  // Cart drawer open state
  const [cartOpen, setCartOpen] = useState(false);

  // Open/close cart drawer handlers
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const products: Product[] = useMemo(
    () => (Array.isArray(data?.data?.data) ? data.data.data : []),
    [data]
  );

  const groupedProducts = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    products
      .filter((p) => p && p._id)
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

        {/* banner */}
        <BannerSlider />

        <h2 className="text-2xl font-bold text-center md:text-left mb-6">
          Recommended Products for you
        </h2>

        {/* Pass openCart to ProductsBySubcategoryPage */}
        <ProductsBySubcategoryPage onOpenCart={openCart} />

        <WishlistHome onOpenCart={openCart} />
      </main>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </div>
  );
};
