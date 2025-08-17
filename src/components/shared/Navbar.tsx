'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGetAllProductsBySearchQuery } from '@/redux/features/Products/productApi';
import { Search, MoreVertical, X } from 'lucide-react';
import Image from 'next/image';
import logo from '../../../public/clickeiBazer-png.png';
import { useDispatch } from 'react-redux';
import { logout, selectCurrentUser } from '@/redux/features/auth/authSlices';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hook';
import type { Product } from '@/types/products';

const examplePlaceholders = [
  'potato', 'milk', 'rice', 'apple', 'banana', 'onion', 'bread', 'egg', 'chicken', 'fish',
];

const exampleColors = [
  '#E53E3E', '#38A169', '#3182CE', '#D69E2E', '#805AD5', '#DD6B20',
];

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const admin = useAppSelector(selectCurrentUser);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const [query, setQuery] = useState('');
  const [field, setField] = useState<'title' | 'name' | 'price' | 'quantity'>('name');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Rotate placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % examplePlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close search dropdown & mobile sidebar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (sidebarOpen && window.innerWidth < 768 && !(event.target as HTMLElement).closest('#mobile-sidebar')) {
        setSidebarOpen(false);
      }
      if (profileDropdownOpen && !(event.target as HTMLElement).closest('#profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, profileDropdownOpen]);

  const { data } = useGetAllProductsBySearchQuery(
    debouncedQuery ? { [field]: debouncedQuery } : {},
    { skip: !debouncedQuery }
  );

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?${field}=${encodeURIComponent(query.trim())}`);
    setShowSearchDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Successfully logged out');
    router.push('/login');
  };

  const placeholderColor = exampleColors[placeholderIndex % exampleColors.length];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-2">

        {/* MOBILE TOP ROW */}
        <div className="flex items-center justify-between md:hidden">
          {/* Logo center */}
          <div className="flex-1 flex justify-center">
            <Link href="/">
              <Image src={logo} alt="ClickeiBazer Logo" width={120} height={60} className="object-contain" />
            </Link>
          </div>

          {/* 3-dot menu toggle only on small screens */}
          {isClient && window.innerWidth < 768 && (
            <button onClick={() => setSidebarOpen(true)}>
              <MoreVertical size={24} className="text-white" />
            </button>
          )}
        </div>

        {/* MOBILE SIDEBAR */}
        {sidebarOpen && window.innerWidth < 768 && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
            <div
              id="mobile-sidebar"
              className="relative w-64 bg-white h-full shadow-lg p-4 flex flex-col"
            >
              <button className="self-end mb-4" onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>

              {isClient && admin?.role !== 'admin' && (
                <>
                  <Link href="/profile" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Your Profile</Link>
                  <Link href="/order" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Your Orders</Link>
                  <Link href="/wishList" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Your WishList</Link>
                  <Link href="/track-order" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Track Order</Link>
                  <Link href="/change-password" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Change Password</Link>
                  <button
                    className="w-full text-left px-2 py-2 text-red-600 hover:bg-red-100 rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}

              {!admin && isClient && (
                <Link href="/login" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Login</Link>
              )}

              {isClient && admin?.role === 'admin' && (
                <Link href="/dashboard" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Dashboard</Link>
              )}
            </div>
          </div>
        )}

        {/* MOBILE SEARCH BAR BELOW TOP ROW */}
        <div className="mt-2 w-full md:hidden flex mb-4 flex-col" ref={dropdownRef}>
          <div className="flex w-full relative">
            <select
              value={field}
              onChange={e => setField(e.target.value as 'title' | 'name' | 'price' | 'quantity')}
              className="h-12 min-w-[90px] border-2 border-amber-600 rounded-l-md bg-white px-2 text-sm text-gray-700 focus:outline-none"
            >
              <option value="title">Title</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
            </select>

            <input
              type={field === 'price' || field === 'quantity' ? 'number' : 'text'}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search ..."
              className={`w-full h-12 pl-4 pr-12 border-2 border-amber-600 bg-white rounded-r-md text-sm caret-black`}
            />

            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600"
              type="button"
            >
              <Search size={20} />
            </button>

            {showSearchDropdown && debouncedQuery && (data?.data?.length ?? 0) > 0 && (
              <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg z-50">
                {data!.data!.map((item: Product) => {
                  let displayText = '';
                  switch (field) {
                    case 'title': displayText = item.title || item.name || 'Untitled'; break;
                    case 'name': displayText = item.name || item.title || 'Unnamed'; break;
                    case 'price': displayText = `৳${item.price ?? 'N/A'} - ${item.title || item.name || ''}`; break;
                    case 'quantity': displayText = `${item.quantity ?? 'N/A'} pcs - ${item.title || item.name || ''}`; break;
                  }
                  return (
                    <Link
                      key={item._id}
                      href={`/products/${item._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setShowSearchDropdown(false)}
                    >
                      {displayText}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP NAVBAR */}
        <div className="hidden md:flex items-center justify-between mt-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="ClickeiBazer Logo" width={120} height={60} className="object-contain" />
          </Link>

          {/* Search */}
          <div className="flex w-full max-w-2xl relative" ref={dropdownRef}>
            <select
              value={field}
              onChange={e => setField(e.target.value as 'title' | 'name' | 'price' | 'quantity')}
              className="h-12 min-w-[90px] border-2 border-amber-600 rounded-l-md bg-white px-2 text-sm text-gray-700 focus:outline-none"
            >
              <option value="title">Title</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
            </select>
            <input
              type={field === 'price' || field === 'quantity' ? 'number' : 'text'}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search ..."
              className="w-full h-12 pl-4 pr-12 border-2 border-amber-600 bg-white rounded-r-md text-sm"
            />
            <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600">
              <Search size={20} />
            </button>
          </div>

          {/* Profile button */}
          {isClient && admin && (
            <div className="relative" id="profile-dropdown">
              <Button
                variant="secondary"
                onClick={() => setProfileDropdownOpen(prev => !prev)}
              >
                Profile
              </Button>

              {showProfileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50 overflow-auto max-h-96"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-menu-button"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/order"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Your Orders
                  </Link>
                  <Link
                    href="/wishList"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Your WishList
                  </Link>
                  <Link
                    href="/track-order"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Track Order
                  </Link>
                  <Link
                    href="/change-password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Change Password
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>


        
      </div>
    </nav>
  );
};

export default Navbar;
