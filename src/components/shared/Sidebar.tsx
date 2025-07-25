'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  useGetAllServicesQuery,
  useLazyServiceFullTreeQuery,
} from '@/redux/features/Services/serviceApi';
import { Service } from '@/types/products';

export default function Sidebar({ onSelectSubcategory }: { onSelectSubcategory: (id: string) => void }) {
  const { data: serviceRes } = useGetAllServicesQuery({});
  const services: Service[] = serviceRes?.data || [];

  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const [fetchFullTree, { data: fullTreeData }] = useLazyServiceFullTreeQuery();

  const handleServiceClick = async (serviceId: string) => {
    if (activeServiceId === serviceId) {
      setActiveServiceId(null);
      setActiveCategoryId(null);
    } else {
      setActiveServiceId(serviceId);
      setActiveCategoryId(null);
      await fetchFullTree(serviceId);
    }
  };

  const activeCategories = fullTreeData?.data?.categories || [];

  return (
    <aside className="w-72 h-screen overflow-y-auto bg-white p-5 border-r border-gray-200 shadow-md">
      {/* Logo & Search */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Chatdad</h1>
        <input
          type="text"
          placeholder="Search for products (e.g. eggs, milk)"
          className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Hierarchical List */}
      <div className="space-y-1">
        {services.map((service) => (
          <div key={service._id}>
            {/* Service Button */}
            <button
              onClick={() => handleServiceClick(service._id)}
              className={`w-full flex justify-between items-center px-4 py-3 rounded-md font-medium text-left transition-colors duration-200 ${
                activeServiceId === service._id
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              <span>{service.name}</span>
              {activeServiceId === service._id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Categories */}
            {activeServiceId === service._id && (
              <div className="ml-3 mt-1 space-y-1">
                {activeCategories.map(({ category, subcategories }: any) => (
                  <div key={category._id}>
                    {/* Category Button */}
                    <button
                      onClick={() =>
                        setActiveCategoryId(
                          activeCategoryId === category._id ? null : category._id
                        )
                      }
                      className={`w-full flex justify-between items-center px-4 py-2 rounded-md text-sm font-medium text-left transition-colors duration-200 ${
                        activeCategoryId === category._id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      {activeCategoryId === category._id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {/* Subcategories */}
                    {activeCategoryId === category._id && (
                      <div className="ml-4 mt-1 space-y-1">
                        {subcategories.map(({ subcategory }: any) => (
                          <button
                            key={subcategory._id}
                            onClick={() => onSelectSubcategory(subcategory._id)}
                            className="w-full px-4 py-2 rounded-md text-sm text-left text-gray-700 hover:bg-gray-100 transition-colors duration-150"
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
  );
}
