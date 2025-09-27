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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Make main content grow to fill space */}
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ReduxProvider>
  );
}
