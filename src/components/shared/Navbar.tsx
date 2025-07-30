'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGetAllProductsBySearchQuery } from '@/redux/features/Products/productApi';
import { Search } from 'lucide-react';
import Image from 'next/image';
import logo from '../../../public/clickeiBazer-png.png';

const Navbar = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [field, setField] = useState('name');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data } = useGetAllProductsBySearchQuery(
    debouncedQuery ? { [field]: debouncedQuery } : {},
    { skip: !debouncedQuery }
  );

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?${field}=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-8xl mx-auto flex items-center justify-between px-4 md:px-8 h-22">
        {/* Logo & Site Name */}
        <Link href="/" className="flex items-center gap-2  m-2">
          <Image src={logo} alt="ClickeiBazer Logo" width={150} height={110} />
          
        </Link>

       {/* Search Bar */}
<div className="flex flex-1 max-w-5xl mx-6">
  <select
    value={field}
    onChange={(e) => setField(e.target.value)}
    className="h-12 min-w-[100px] border-2 border-amber-600 rounded-l-md bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600 "
    aria-label="Search field selector"
  >
    <option value="title">Title</option>
    <option value="name">Name</option>
    <option value="price">Price</option>
    <option value="quantity">Quantity</option>
  </select>

  <div className="relative flex-grow">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={`Search by ${field}...`}
      className="w-full h-12 pl-12 pr-12 border-2 border-amber-600 bg-white rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm"
      aria-label="Search input"
    />
    <button
      onClick={handleSearch}
      aria-label="Search button"
      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
      type="button"
    >
      <Search size={18} />
    </button>

    {/* Suggestions */}
    {debouncedQuery && data?.data?.length > 0 && (
      <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg z-50">
        {data.data.map((item: any) => (
          <Link
            key={item._id}
            href={`/products/${item._id}`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {item.title || item.name}
          </Link>
        ))}
      </div>
    )}
  </div>
</div>

        {/* Right Side: Auth / Profile */}
        <div className="flex items-center gap-6  text-xl text-white">
          <Link
            href="/dashboard"
            className="hover:underline hover:text-amber-600 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="hover:underline hover:text-amber-600 transition"
          >
            Login
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="default"
              onClick={() => setShowDropdown(!showDropdown)}
            className='hover:text-amber-600'
            >
              Profile
            </Button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Your Orders
                </Link>
                <Link
                  href="/payments"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Your Payment
                </Link>
                <Link
                  href="/change-password"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Change Password
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                  onClick={() => {
                    console.log('Logged out');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
