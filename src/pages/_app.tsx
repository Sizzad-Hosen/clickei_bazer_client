import type { AppProps } from 'next/app';
import { ReduxProvider } from '../app/Providers';
import { Toaster } from 'sonner';
import Navbar from '@/components/shared/Navbar';
import '../app/globals.css';
import { CartProvider } from '@/components/context/CartContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
        <CartProvider>
      <Toaster richColors position="top-center" />
      <Navbar />
      <Component {...pageProps} />
      </CartProvider>
    </ReduxProvider>
  );
}
