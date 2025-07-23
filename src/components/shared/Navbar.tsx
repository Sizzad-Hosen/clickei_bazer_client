import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, User } from "lucide-react";


export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-yellow-400">
      <div className="flex items-center gap-2">
        <button className="md:hidden">
          <span className="text-xl">☰</span>
        </button>
        <span className="font-bold text-xl text-white">CLICKEIBAZZER</span>
      </div>

      <div className="flex-1 mx-4 max-w-3xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search for products (e.g. eggs, milk, potato)"
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 text-white">
        <MapPin className="w-4 h-4" />
        <span>Dhaka</span>
        <Button variant="ghost" className="text-white hover:bg-yellow-500">
          <User className="mr-1 w-4 h-4" /> Login
        </Button>
      </div>
    </header>
  );
}
