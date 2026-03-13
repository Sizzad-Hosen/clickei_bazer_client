'use client';
import { ReactNode } from 'react';
import { ReduxProvider } from './Providers';
import { Toaster } from 'sonner';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { CartProvider } from '@/components/context/CartContext';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <Toaster richColors position="top-center" />
      <div className="flex flex-col min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </CartProvider>
        <Footer />
      </div>
    </ReduxProvider>
  );
}
