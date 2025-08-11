'use client';

import React, { ReactNode, useState } from "react";
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

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard Home", icon: Home },
  { href: "/dashboard/services", label: "Services", icon: Box },
  { href: "/dashboard/services/create-services", label: "Create Service", icon: PlusCircle },
  { href: "/dashboard/categories", label: "Categories", icon: Layers },
  { href: "/dashboard/categories/create-category", label: "Create Category", icon: PlusCircle },
  { href: "/dashboard/subCategories", label: "SubCategories", icon: Layers },
  { href: "/dashboard/subCategories/create-subCategory", label: "Create SubCategory", icon: PlusCircle },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/products/create-product", label: "Create Product", icon: PlusCircle },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/customBazarOrders", label: "Custom Bazar Orders", icon: ShoppingCart },
  { href: "/dashboard/create-custom-bazar", label: "Create Custom Bazar", icon: Menu},
  { href: "/dashboard/custom-bazar-products", label: "Custom Bazar Products", icon: Box},
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/", label: "Home", icon: HomeIcon },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle */}
      <div className="flex justify-between items-center md:hidden p-4 bg-white shadow">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-72 bg-white border-r border-gray-200 shadow-sm p-6 md:min-h-screen overflow-y-auto`}
      >
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
      <main className="flex-1 p-4 sm:p-6 md:p-10 bg-white rounded-lg shadow-lg overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
