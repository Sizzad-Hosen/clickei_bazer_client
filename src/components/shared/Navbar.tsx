import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="relative z-10">
      {/* Top Navbar with Gradient */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 shadow-md border-b border-transparent gap-3 md:gap-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
        {/* Logo & Menu */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2">
            <button className="md:hidden">
              <span className="text-2xl text-white">☰</span>
            </button>
            <span className="font-bold text-lg sm:text-xl tracking-wide">
              CLICKEIBAZZER
            </span>
          </div>
        </div>

        {/* Search Bar */}
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

        {/* Right Section: Dashboard, Location, Login */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 w-full md:w-auto">
          <Link href="/dashboard">
            <span className="text-xs sm:text-sm md:text-base font-medium">
              Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-white" />
            <span className="text-xs sm:text-sm">Dhaka</span>
          </div>

          <Button variant="secondary" className="text-xs sm:text-sm md:text-base px-3 py-1 text-black bg-white hover:bg-gray-100">
            <Link href="/login" className="flex items-center gap-1">
              <User className="w-4 h-4" /> Login
            </Link>
          </Button>
        </div>
      </div>

      {/* Optional Bottom Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
    </header>
  );
}
