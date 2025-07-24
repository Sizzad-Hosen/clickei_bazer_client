import React, { ReactNode } from "react";
import Link from "next/link";
import {
  Home,
  Box,
  PlusCircle,
  Layers,
  Package,
  ShoppingCart,
  Users,
  Bell,
  Settings,
} from "lucide-react";

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
  { href: "/dashboard/create-product", label: "Create Product", icon: PlusCircle },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/notification", label: "Notifications", icon: Bell },
  { href: "/dashboard/custom-bazzer", label: "Custom Bazzer", icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 shadow-sm p-6 min-h-screen overflow-y-auto">
        <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-gray-900">
          Dashboard
        </h2>
        <nav className="flex flex-col space-y-2 text-gray-700 text-sm font-medium">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-white rounded-lg shadow-lg overflow-y-auto">
        {children}
      </main>
    </div>
  );
}


