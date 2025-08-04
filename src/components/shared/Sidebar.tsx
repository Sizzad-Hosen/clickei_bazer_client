'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  useGetAllServicesQuery,
  useLazyServiceFullTreeQuery,
} from '@/redux/features/Services/serviceApi';
import { Service } from '@/types/products';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function Sidebar({ onSelectSubcategory }: { onSelectSubcategory: (id: string) => void }) {
  const router = useRouter();
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
    <aside className="w-full md:w-72 h-screen mx-auto overflow-y-auto bg-gray-100 p-4 md:p-5 border-r border-gray-200 shadow-md">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">Our Services</h1>
        <hr className="border-t border-dashed border-gray-400 my-2" />
<Link href={"/customBazar"}>
   <Button 
         className='text-xl md:text-2xl  text-gray-800 ps-2 ' >
          Custom Bazar
         </Button>


</Link>
     

      </div>

      <div className="space-y-1">
        {services.map((service) => (
          <div key={service._id}>
            <button
              onClick={() => handleServiceClick(service._id)}
              className={`
                w-full flex justify-between items-center px-3 md:px-4 py-2 md:py-3 rounded-md font-medium text-left transition-colors duration-200
                ${activeServiceId === service._id
                  ? 'bg-blue-100 text-amber-600'
                  : 'hover:bg-gray-300 text-gray-800 touch-active:bg-gray-300'}
              `}
            >
              <span className="text-sm md:text-base">{service.name}</span>
              {activeServiceId === service._id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {activeServiceId === service._id && (
              <div className="ml-2 md:ml-3 mt-1 space-y-1">
                {activeCategories.map(({ category, subcategories }: any) => (
                  <div key={category._id}>
                    <button
                      onClick={() =>
                        setActiveCategoryId(
                          activeCategoryId === category._id ? null : category._id
                        )
                      }
                      className={`
                        w-full flex justify-between items-center px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium text-left transition-colors duration-200
                        ${activeCategoryId === category._id
                          ? 'bg-blue-50 text-amber-600'
                          : 'hover:bg-gray-300 text-gray-700 touch-active:bg-gray-300'}
                      `}
                    >
                      <span>{category.name}</span>
                      {activeCategoryId === category._id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {activeCategoryId === category._id && (
                      <div className="ml-3 md:ml-4 mt-1 space-y-1">
                        {subcategories.map(({ subcategory }: any) => (
                          <button
                            key={subcategory._id}
                            onClick={() => router.push(`/products/${subcategory._id}`)}
                            className="
                              w-full px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm text-left text-gray-700
                              hover:bg-gray-100 hover:text-amber-600
                              transition-colors duration-150 touch-active:bg-gray-300
                            "
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