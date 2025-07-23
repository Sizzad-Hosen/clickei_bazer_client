import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="relative z-10 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
      <div className="flex items-center justify-between px-4 py-3 bg-Cyan-500 shadow-md border-b border-transparent">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <button className="md:hidden">
            <span className="text-2xl text-gray-700">☰</span>
          </button>
          <span className="font-bold text-xl text-gray-800 tracking-wide">
            CLICKEIBAZZER
          </span>
        </div>

        {/* Search with Gradient Border */}
        <div className="flex-1 mx-4 max-w-3xl">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <div className="p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md">
              <Input
                type="text"
                placeholder="Search for products (e.g. eggs, milk, potato)"
                className="pl-10 bg-white text-gray-800 rounded-md outline-none focus:ring-0 focus-visible:ring-0 border-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Login */}
        <div className="flex items-center gap-3 text-gray-700">
          <Link href={"/dashboard"}>
          <span  className="text-sm font-medium">Dasboard</span>
          </Link>
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">Dhaka</span>
          <Button
            variant="default"
            className=""
          >
            <User className="mr-1 w-4 h-4" /> Login
          </Button>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
    </header>
  );
}
