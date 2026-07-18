// app/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { ReduxProvider } from "./Providers"; // Path correct
import { Toaster } from "sonner";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Spinner from "@/components/Spinner";
import { useGetMeQuery } from "@/redux/features/auth/authApi";

function AppShell({ children }: { children: ReactNode }) {
  const { isLoading } = useGetMeQuery();

  if (isLoading) return <Spinner />;

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" className="min-w-0 max-w-full flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <AppShell>{children}</AppShell>
    </ReduxProvider>
  );
}
