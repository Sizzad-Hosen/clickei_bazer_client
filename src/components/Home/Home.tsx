'use client';

import { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import BannerSlider from './Banner';
import WishlistHome from './HomeWishList';
import CartDrawer from '../Carts/CartDrawer';
import AllService from './AllService';
import ProductsBySubcategoryPage from './SubCategoryWiseProducts';

import { MessageCircle, Phone, MessageSquare, Mail } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  return (
    <div className="min-h-screen flex md:flex-row flex-col bg-white gap-6 relative">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r shadow-sm md:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-none p-4 md:p-6">
        <BannerSlider />
        <AllService />
        <ProductsBySubcategoryPage onOpenCart={openCart} />
        <WishlistHome onOpenCart={openCart} />
      </main>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={closeCart} />

      {/* Floating Message Button */}
      <div className="fixed bottom-4 right-2 flex flex-col items-end gap-3 z-50">
        {isFabOpen && (
          <div className="flex flex-col items-end gap-3">
            <a
              href="https://www.facebook.com/share/1Fh8DHu1UG/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition"
            >
              <MessageSquare className="h-6 w-6" />
            </a>

            <a
              href="https://wa.me/8801346508284"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition"
            >
              <FaWhatsapp className="h-6 w-6" />
            </a>

            <a
              href="tel:+8801346508284"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition"
            >
              <Phone className="h-6 w-6" />
            </a>

            <a
              href="mailto:clickeibazer2025july@gmail.com"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500 text-white shadow hover:bg-red-600 transition"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        )}

        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-700 transition"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
