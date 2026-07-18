'use client';

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import {
  Home,
  Box,
  PlusCircle,
  Layers,
  Package,
  ShoppingCart,
  Users,
  HomeIcon,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { logout } from "@/redux/features/auth/authSlices";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLogoutMutation } from "@/redux/features/auth/authApi";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard Home", icon: Home },
  { href: "/dashboard/services", label: "Services", icon: Box },
  { href: "/dashboard/categories", label: "Categories", icon: Layers },
  { href: "/dashboard/subCategories", label: "SubCategories", icon: Layers },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/products/create-product", label: "Create Product", icon: PlusCircle },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/customBazarOrders", label: "CustomBazar Orders", icon: ShoppingCart },
  { href: "/dashboard/custom-bazar-products", label: "View CustomBazar Products", icon: Box},
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/", label: "Home", icon: HomeIcon },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutFromServer] = useLogoutMutation();

  useEffect(() => {
    if (!sidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try { await logoutFromServer().unwrap(); } catch { /* Clear local session even if offline. */ }
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
    <div className="flex min-h-screen min-w-0 max-w-full flex-col bg-gray-50 md:flex-row">
      {/* Mobile Menu Toggle */}
      <div className="flex justify-between items-center md:hidden p-4 bg-white shadow">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button type="button" aria-label={sidebarOpen ? 'Close dashboard menu' : 'Open dashboard menu'} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          className="fixed inset-0 z-[60] bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "flex" : "hidden"
        } fixed inset-y-0 left-0 z-[70] w-72 max-w-[calc(100vw-2rem)] flex-col overflow-y-auto border-r border-gray-200 bg-white p-6 shadow-sm md:static md:flex md:min-h-screen md:max-w-none`}
      >
        <button type="button" aria-label="Close dashboard menu" className="mb-4 self-end rounded p-2 md:hidden" onClick={() => setSidebarOpen(false)}>
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-gray-900 hidden md:block">
          Dashboard
        </h2>
        <nav className="flex flex-col space-y-2 text-gray-700 text-sm font-medium">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 hover:text-gray-900 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-red-600 hover:bg-red-100 transition mt-4"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 max-w-full flex-1 overflow-y-auto bg-white py-4 shadow-lg md:rounded-lg md:py-8">
        {children}
      </main>
    </div>
    </ProtectedRoute>
  );
}
