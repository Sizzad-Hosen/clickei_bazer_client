'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, MoreVertical, X } from 'lucide-react';
import Image from 'next/image';
import logo from '../../../public/clickeiBazer-png.png';
import { useDispatch } from 'react-redux';
import { logout, selectCurrentUser } from '@/redux/features/auth/authSlices';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hook';
import { useGetAllProductsBySearchQuery } from '@/redux/features/Products/productApi';
import type { Product } from '@/types/products';

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useAppSelector(selectCurrentUser);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const dropdownRefDesktop = useRef<HTMLDivElement>(null);
  const dropdownRefMobile = useRef<HTMLDivElement>(null);

  useEffect(() => setIsClient(true), []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRefDesktop.current && !dropdownRefDesktop.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (dropdownRefMobile.current && !dropdownRefMobile.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (profileDropdownOpen && !(event.target as HTMLElement).closest('#profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  const { data, isFetching } = useGetAllProductsBySearchQuery(
    debouncedQuery ? { title: debouncedQuery } : {},
    { skip: !debouncedQuery }
  );

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?title=${encodeURIComponent(query.trim())}`);
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

  const renderSuggestions = () => 
    showSearchDropdown &&
    debouncedQuery &&
    !isFetching &&
    (data?.data?.length ?? 0) > 0 && (
      <div className="absolute left-0 right-0 mt-1 max-h-64 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg z-50">
        {data!.data!.map((item: Product) => (
          <Link
            key={item._id}
            href={`/products/${item._id}`}
            className="block px-3 py-2 hover:bg-gray-100"
            onClick={() => setShowSearchDropdown(false)}
          >
            <div className="flex items-center gap-3">
              {item.images?.[0] && (
                <Image
                  src={item.images[0]}
                  alt={item.title || item.name}
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-800">{item.title || item.name}</p>
                {item.price && <p className="text-xs text-gray-500">৳{item.price}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );

  if (!isClient) return null;

  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-2">

        {/* MOBILE NAVBAR */}
        <div className="flex items-center justify-between md:hidden">
          <Link href="/" className="flex-1 flex justify-center">
            <Image src={logo} alt="ClickeiBazer Logo" width={100} height={40} className="object-contain" />
          </Link>
          {user ? (
            <button onClick={() => setSidebarOpen(true)}>
              <MoreVertical size={24} className="text-white" />
            </button>
          ) : (
            <Link href="/login">
              <Button variant="secondary" className="px-3 py-1 text-sm">Login</Button>
            </Link>
          )}
        </div>

        {/* MOBILE SEARCH */}
        <div className="mt-2 w-full md:hidden flex flex-col" ref={dropdownRefMobile}>
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowSearchDropdown(true); }}
              onKeyDown={handleKeyDown}
              placeholder="Search ..."
              className="w-full h-12 pl-4 pr-12 border-2 border-amber-600 bg-white rounded-md text-sm"
            />
            <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600">
              <Search size={20} />
            </button>
            {renderSuggestions()}
          </div>
        </div>

        {/* MOBILE SIDEBAR */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div id="mobile-sidebar" className="relative w-64 bg-white h-full shadow-lg p-2 flex flex-col">
              <button className="self-end mb-4" onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
              {user ? (
                user.role === 'admin' ? (
                  <Link href="/dashboard" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Dashboard</Link>
                ) : (
                  <>
                    <Link href="/profile" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Your Profile</Link>
                    <Link href="/order" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Your Orders</Link>
                    <Link href="/wishList" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Your WishList</Link>
                    <Link href="/track-order" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Track Order</Link>
                    <Link href="/change-password" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Change Password</Link>
                    <button onClick={handleLogout} className="w-full text-left px-2 py-2 text-red-600 hover:bg-red-100 rounded">Logout</button>
                  </>
                )
              ) : (
                <Link href="/login" className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded">Login</Link>
              )}
            </div>
          </div>
        )}

        {/* DESKTOP NAVBAR */}
        <div className="hidden md:flex items-center justify-between mt-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src={logo} alt="ClickeiBazer Logo" width={120} height={60} className="object-contain" />
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="flex w-full max-w-2xl relative" ref={dropdownRefDesktop}>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowSearchDropdown(true); }}
              onKeyDown={handleKeyDown}
              placeholder="Search ..."
              className="w-full h-12 pl-4 pr-12 border-2 border-amber-600 bg-white rounded-md text-sm"
            />
            <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600">
              <Search size={20} />
            </button>
            {renderSuggestions()}
          </div>

          {/* PROFILE / DASHBOARD */}
          <div className="relative" id="profile-dropdown">
            {user ? (
              <Button variant="secondary" onClick={() => setProfileDropdownOpen(prev => !prev)}>
                {user.role === 'admin' ? (
                  <Link href="/dashboard">Dashboard</Link>
                ) : 'User Home'}
              </Button>
            ) : (
              <Link href="/login" className="px-4 py-2 border-amber-600 bg-amber-200 text-gray-700 hover:bg-gray-100 rounded">Login</Link>
            )}
            {profileDropdownOpen && user && user.role !== 'admin' && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50 overflow-auto max-h-96">
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>Your Profile</Link>
                <Link href="/order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>Your Orders</Link>
                <Link href="/wishList" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>Your WishList</Link>
                <Link href="/track-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>Track Order</Link>
                <Link href="/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setProfileDropdownOpen(false)}>Change Password</Link>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
