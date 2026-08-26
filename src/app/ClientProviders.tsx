// app/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { ReduxProvider } from "./Providers"; // Path correct
import { Toaster } from "sonner";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentToken, selectCurrentUser } from "@/redux/features/auth/authSlices";

function AppShell({ children }: { children: ReactNode }) {
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);
  useGetMeQuery(undefined, { skip: !user || Boolean(token) });

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
