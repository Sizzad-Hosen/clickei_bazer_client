// app/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { ReduxProvider } from "./Providers"; // Path correct
import { Toaster } from "sonner";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <Toaster richColors position="top-center" />
      <Navbar />
      {children}
      <Footer></Footer>
    </ReduxProvider>
  );
}
