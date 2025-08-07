'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGetAllProductsBySearchQuery } from '@/redux/features/Products/productApi';
import { Search } from 'lucide-react';
import Image from 'next/image';
import logo from '../../../public/clickeiBazer-png.png';
import { useDispatch } from 'react-redux';
import { logout, selectCurrentUser } from '@/redux/features/auth/authSlices';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hook';

const Navbar = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const admin = useAppSelector(selectCurrentUser);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [query, setQuery] = useState('');
  const [field, setField] = useState('name');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

  const handleLogout = async () => {
    dispatch(logout());
    toast.success('Successfully logged out');
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-sm sticky top-0 z-50 w-full">
      {/* Top Contact Bar */}
      <div className="bg-gray-900 text-sm text-gray-300 px-4 py-2 flex justify-around items-center flex-wrap gap-2">
        <h1 className="font-medium">
          Contact:{" "}
          <a href="mailto:clickeibazer2025july@gmail.com" className="text-blue-400 hover:underline">
            clickeibazer2025july@gmail.com
          </a>{" "}
          | Phone:{" "}
          <a href="tel:01745455353" className="text-blue-400 hover:underline">
            01745455353
          </a>
        </h1>

        <a
          href="https://www.facebook.com/share/1Fh8DHu1UG/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-4 h-4"
          >
            <path d="M22 12a10 10 0 1 0-11.63 9.87v-7H8v-3h2.37V9.5c0-2.3 1.37-3.57 3.47-3.57.7 0 1.44.12 1.44.12v1.58H14.6c-1.14 0-1.5.71-1.5 1.44V12h2.56l-.41 3h-2.15v7A10 10 0 0 0 22 12z" />
          </svg>
          Facebook
        </a>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-1 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="ClickeiBazer Logo"
            width={120}
            height={60}
            className="object-contain"
          />
        </Link>

        {/* Search */}
        <div className="flex w-full max-w-2xl md:flex-1">
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="h-12 min-w-[90px] border-2 border-amber-600 rounded-l-md bg-white px-2 text-sm text-gray-700 focus:outline-none"
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
              className="w-full h-12 pl-4 pr-12 border-2 border-amber-600 bg-white rounded-r-md text-sm"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600"
              aria-label="Search"
              type="button"
            >
              <Search size={20} />
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

        {/* Right side */}
        <div className="relative flex items-center gap-4 text-white mt-2 md:mt-0">
          {isClient && admin?.role === 'admin' && (
            <Link href="/dashboard" className="hover:text-amber-500 text-sm md:text-base">
              Dashboard
            </Link>
          )}

          {isClient && admin?.role !== 'admin' && (
            <div className="relative" ref={dropdownRef}>
              <Button variant="secondary" onClick={() => setShowDropdown(!showDropdown)}>
                Profile
              </Button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50 overflow-auto max-h-96">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <Link href="/order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Orders
                  </Link>
                  <Link href="/wishList" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your WishList
                  </Link>
                  <Link href="/track-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Track Order
                  </Link>
                 
                  <Link href="/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Change Password
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!admin && isClient && (
            <Link href="/login" className="hover:text-amber-500 text-sm md:text-base">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
