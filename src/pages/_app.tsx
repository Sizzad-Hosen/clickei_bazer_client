import type { AppProps } from 'next/app';
import { ReduxProvider } from '../app/Providers';
import { Toaster } from 'sonner';
import Navbar from '@/components/shared/Navbar';
import '../app/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Toaster richColors position="top-center" />
      <Navbar />
      <Component {...pageProps} />
    </ReduxProvider>
  );
}