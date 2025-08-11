'use client';

import { useState, useMemo } from 'react';
import { useGetAllProductsQuery } from '@/redux/features/Products/productApi';
import { Product } from '@/types/products';
import Sidebar from '../shared/Sidebar';
import WishlistHome from './HomeWishList';
import CartDrawer from '../Carts/CartDrawer';
import BannerSlider from './Banner';
import ProductsBySubcategoryPage from './SubCategoryWiseProducts';

export const Home = () => {
  const { data } = useGetAllProductsQuery({});

  // Cart drawer open state
  const [cartOpen, setCartOpen] = useState(false);

  // Open/close cart drawer handlers
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  // Safely get products array
const products: Product[] = useMemo(() => {
  return Array.isArray(data?.data?.data) ? data.data.data : [];
}, [data]);


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white gap-6 overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r shadow-sm md:block">
        <Sidebar />
      </div>

      {/* Main */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-6">
        {/* Banner */}
        <BannerSlider />

        <h2 className="text-2xl font-bold text-center md:text-left mb-6">
          Recommended Products for you
        </h2>

        {/* Products list */}
        <ProductsBySubcategoryPage onOpenCart={openCart} />

        {/* Wishlist */}
        <WishlistHome onOpenCart={openCart} />
      </main>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </div>
  );
};
