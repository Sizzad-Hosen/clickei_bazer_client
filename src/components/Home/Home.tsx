'use client';

import { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import BannerSlider from './Banner';
import WishlistHome from './HomeWishList';
import CartDrawer from '../Carts/CartDrawer';

import AllService from './AllService';

import ProductsBySubcategoryPage from './SubCategoryWiseProducts';

export default function Home() {
  
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);



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
       <AllService></AllService>
 

<ProductsBySubcategoryPage onOpenCart={openCart} ></ProductsBySubcategoryPage>

        {/* Wishlist */}
        <WishlistHome onOpenCart={openCart} />
      </main>

      <CartDrawer open={cartOpen} onClose={closeCart} />
    </div>
  );
}
