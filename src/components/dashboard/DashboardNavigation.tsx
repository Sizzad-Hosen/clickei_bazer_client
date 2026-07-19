'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  Home,
  HomeIcon,
  Layers,
  LogOut,
  Package,
  PlusCircle,
  ShoppingCart,
  Users,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard Home', icon: Home },
  { href: '/dashboard/services', label: 'Services', icon: Box },
  { href: '/dashboard/categories', label: 'Categories', icon: Layers },
  { href: '/dashboard/subCategories', label: 'SubCategories', icon: Layers },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/products/create-product', label: 'Create Product', icon: PlusCircle },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/customBazarOrders', label: 'CustomBazar Orders', icon: ShoppingCart },
  { href: '/dashboard/custom-bazar-products', label: 'View CustomBazar Products', icon: Box },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/', label: 'Home', icon: HomeIcon },
];

interface DashboardNavigationProps {
  onNavigate?: () => void;
  onLogout: () => void;
}

export function DashboardNavigation({ onNavigate, onLogout }: DashboardNavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="flex flex-col gap-1 text-sm font-medium text-gray-700">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/dashboard'
          ? pathname === href
          : href !== '/' && Boolean(pathname?.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
              isActive
                ? 'bg-amber-50 text-amber-800'
                : 'hover:bg-gray-100 hover:text-gray-900'
            }`}
            onClick={onNavigate}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-words">{label}</span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          onLogout();
        }}
        className="mt-3 flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-red-600 transition-colors hover:bg-red-50"
      >
        <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
        Logout
      </button>
    </nav>
  );
}
