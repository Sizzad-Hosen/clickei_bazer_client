'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  History,
  CreditCard,
  Home,
  KeyRound,
  RefreshCcw,
  ShoppingCart,
  UserCircle2,
  MapPin,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useAppSelector } from "@/redux/hook";
import { useDispatch } from "react-redux";
import { logout, selectCurrentUser } from "@/redux/features/auth/authSlices";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="relative z-10">
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 shadow-md border-b border-transparent gap-3 md:gap-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
        
        {/* Left: Logo */}
        <div className="flex items-center justify-between mr-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <button className="md:hidden">
              <span className="text-2xl text-white">☰</span>
            </button>
            <span className="font-bold text-lg sm:text-xl tracking-wide">
              <Link href="/" className="text-white">CLICKEIBAZZER</Link>
            </span>
          </div>
        </div>

        {/* Middle: Search Bar */}
        <div className="w-full md:flex-1 max-w-full md:max-w-3xl">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <div className="p-[1px] bg-white rounded-md">
              <Input
                type="text"
                placeholder="Search for products (e.g. eggs, milk, potato)"
                className="pl-10 w-full text-gray-800 rounded-md outline-none focus:ring-0 focus-visible:ring-0 border-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Links & Profile */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 w-full md:w-auto">
          <Link href="/dashboard">
            <span className="text-xs sm:text-sm md:text-base font-medium">
              Dashboard
            </span>
          </Link>
          <Link href="/login">
            <span className="text-xs sm:text-sm md:text-base font-medium">
             Login
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-white" />
            <span className="text-xs sm:text-sm">Dhaka</span>
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="text-xs sm:text-sm md:text-base px-3 py-1 text-black bg-white hover:bg-gray-100"
              >
                <User className="w-4 h-4 mr-1" />
                Profile
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuLabel className="text-gray-700 font-semibold">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <UserCircle2 className="w-4 h-4 mr-2" /> Your Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/orders')}>
                <ShoppingCart className="w-4 h-4 mr-2" /> Your Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/history')}>
                <History className="w-4 h-4 mr-2" /> Your History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/payments')}>
                <CreditCard className="w-4 h-4 mr-2" /> Your Payment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/address')}>
                <Home className="w-4 h-4 mr-2" /> Your Address
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/change-password')}>
                <KeyRound className="w-4 h-4 mr-2" /> Change Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/forgot-password')}>
                <RefreshCcw className="w-4 h-4 mr-2" /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2 text-red-500" />
                <span className="text-red-500">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom border line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
    </header>
  );
};
