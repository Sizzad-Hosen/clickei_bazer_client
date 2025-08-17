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
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null); // for both dropdowns container

  // Rotate placeholder text color and index
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % examplePlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Debounce input query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
        setShowProfileDropdown(false);
      }
    }
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
     

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-1 gap-4">

        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="ClickeiBazer Logo" width={120} height={60} className="object-contain" />
        </Link>

        {/* Search */}
        <div className="flex w-full max-w-2xl md:flex-1 relative" ref={dropdownRef}>
          <select
            value={field}
            onChange={e => setField(e.target.value as 'title' | 'name' | 'price' | 'quantity')}
            className="h-12 min-w-[90px] border-2 border-amber-600 rounded-l-md bg-white px-2 text-sm text-gray-700 focus:outline-none"
            aria-label="Search field selector"
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
            className={`w-full h-12 pl-4 pr-12 border-2 border-amber-600 bg-white rounded-r-md text-sm caret-black ${
              query ? 'text-gray-900' : 'text-transparent'
            }`}
            min={field === 'price' || field === 'quantity' ? 0 : undefined}
            step={field === 'price' || field === 'quantity' ? 'any' : undefined}
            spellCheck={false}
            autoComplete="off"
            aria-label="Search input"
          />

          {!query && (
            <div
              className="pointer-events-none absolute left-[104px] top-1/2 -translate-y-1/2 text-sm select-none"
              style={{ color: placeholderColor, fontWeight: '500' }}
            >
              Search <span className="font-bold">{examplePlaceholders[placeholderIndex]}</span>...
            </div>
          )}

          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600"
            aria-label="Search"
            type="button"
          >
            <Search size={20} />
          </button>

          {showSearchDropdown && debouncedQuery && (data?.data?.length ?? 0) > 0 && (
            <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg z-50">
              {data!.data!.map((item: Product) => {
                let displayText = '';
                switch (field) {
                  case 'title':
                    displayText = item.title || item.name || 'Untitled';
                    break;
                  case 'name':
                    displayText = item.name || item.title || 'Unnamed';
                    break;
                  case 'price':
                    displayText = `৳${item.price ?? 'N/A'} - ${item.title || item.name || ''}`;
                    break;
                  case 'quantity':
                    displayText = `${item.quantity ?? 'N/A'} pcs - ${item.title || item.name || ''}`;
                    break;
                  default:
                    displayText = item.title || item.name || '';
                }
                return (
                  <Link
                    key={item._id}
                    href={`/products/${item._id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowSearchDropdown(false)}
                  >
                    {displayText}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="relative flex items-center gap-4 text-white mt-2 md:mt-0" ref={dropdownRef}>
          {isClient && admin?.role === 'admin' && (
            <Link href="/dashboard" className="hover:text-amber-500 text-sm md:text-base">
              Dashboard
            </Link>
          )}

          {isClient && admin?.role !== 'admin' && (
            <div className="relative">
              <Button
                variant="secondary"
                onClick={() => setShowProfileDropdown((prev) => !prev)}
                aria-expanded={showProfileDropdown}
                aria-haspopup="true"
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
