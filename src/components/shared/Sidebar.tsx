'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { useGetAllServicesQuery, useLazyServiceFullTreeQuery } from '@/redux/features/Services/serviceApi';
import { Button } from '../ui/button';
import Link from 'next/link';

interface SubcategoryItem { _id: string; name: string; }
interface CategoryItem { _id: string; name: string; }
interface CategoryTree { category: CategoryItem; subcategories: { subcategory: SubcategoryItem }[]; }

interface SidebarProps {
  onSelectSubcategory?: (id: string) => void;
}

export default function Sidebar({ onSelectSubcategory }: SidebarProps) {
  const router = useRouter();
  const { data: serviceRes } = useGetAllServicesQuery({});
  const services = serviceRes?.data || [];

  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [fetchFullTree] = useLazyServiceFullTreeQuery();

  const handleServiceClick = async (serviceId: string) => {
    // Always fetch, even if the same service
    await fetchFullTree(serviceId)
      .unwrap()
      .then((res: any) => {
        setCategories(res?.data?.categories || []);
        setActiveServiceId(serviceId);
        setActiveCategoryId(null); // reset active category
      })
      .catch(console.error);
  };

  const handleNavigate = (path: string) => {
    setMobileOpen(false);
    router.push(path);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        aria-label="Toggle menu"
        onClick={() => setMobileOpen(!mobileOpen)}
        className={`fixed left-2 z-[999] md:hidden bg-white rounded-md p-2 shadow-md ${mobileOpen ? 'top-0' : 'top-10'}`}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black bg-opacity-40 z-40" />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-gray-100 p-4 border-r border-gray-200 shadow-md transform transition-transform duration-300 z-50 md:static md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">Our Services</h1>
          <hr className="border-t border-dashed border-gray-400 my-2" />
          <Link href="/customBazar" onClick={() => setMobileOpen(false)}>
            <Button variant="secondary" className="text-xl w-full border border-amber-50 md:text-2xl text-gray-800 ps-2">Custom Bazar</Button>
          </Link>
        </div>

        <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {services.map(service => (
            <div key={service._id}>
              <button
                onClick={() => handleServiceClick(service._id)}
                className={`w-full flex justify-between items-center px-3 md:px-4 py-2 md:py-3 rounded-md font-medium text-left transition-colors duration-200 ${activeServiceId === service._id ? 'bg-blue-100 text-amber-600' : 'hover:bg-gray-300 text-gray-800'}`}
              >
                <span className="text-sm md:text-base">{service.name}</span>
                {activeServiceId === service._id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {activeServiceId === service._id && categories.length > 0 && (
                <div className="ml-2 md:ml-3 mt-1 space-y-1">
                  {categories.map(({ category, subcategories }) => (
                    <div key={category._id}>
                      <button
                        onClick={() => setActiveCategoryId(activeCategoryId === category._id ? null : category._id)}
                        className={`w-full flex justify-between items-center px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium text-left transition-colors duration-200 ${activeCategoryId === category._id ? 'bg-blue-50 text-amber-600' : 'hover:bg-gray-300 text-gray-700'}`}
                      >
                        <span>{category.name}</span>
                        {activeCategoryId === category._id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>

                      {activeCategoryId === category._id && (
                        <div className="ml-3 md:ml-4 mt-1 space-y-1">
                          {subcategories.map(({ subcategory }) => (
                            <button
                              key={subcategory._id}
                              onClick={() => {
                                handleNavigate(`/products/${subcategory._id}`);
                                onSelectSubcategory?.(subcategory._id);
                              }}
                              className="w-full px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-amber-600 transition-colors duration-150"
                            >
                              {subcategory.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
