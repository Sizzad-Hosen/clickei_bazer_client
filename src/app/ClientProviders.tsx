// app/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { ReduxProvider } from "@/app/Providers"; // your Redux provider
import { Toaster } from "sonner";
import Navbar from "@/components/shared/Navbar";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <Toaster richColors position="top-center" />
      <Navbar />
      {children}
    </ReduxProvider>
  );
}
