'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useLazyServiceHomeFullTreeQuery } from '@/redux/features/Services/serviceApi';
import Spinner from '@/components/Spinner';
import Sidebar from '@/components/shared/Sidebar';

export default function ServicePage() {
  const params = useParams();
  const serviceName = params?.serviceName as string;
  const serviceId = params?.serviceId as string;
  console.log('Service Name:', serviceId)

  const [fetchFullTree, { isFetching }] = useLazyServiceHomeFullTreeQuery();
  const [categories, setCategories] = useState<any[]>([]);
  const [activeService, setActiveService] = useState<string | null>(serviceId || null);

  const fetchCategories = useCallback(
    async (id: string) => {
      try {
        const res: any = await fetchFullTree(id).unwrap();
        setCategories(res?.data?.categories || []);
      } catch (err) {
        console.error(err);
      }
    },
    [fetchFullTree]
  );

  // Fetch categories when activeService changes
  useEffect(() => {
    if (activeService) fetchCategories(activeService);
  }, [activeService, fetchCategories]);

  // Force re-fetch if serviceId changes
  useEffect(() => {
    if (serviceId && serviceId !== activeService) {
      setActiveService(serviceId);
    } else if (serviceId) {
      fetchCategories(serviceId);
    }
  }, [serviceId, fetchCategories, activeService]);

  if (isFetching) return <Spinner />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r bg-gray-50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ms-6 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          All {serviceName} Categories
        </h1>

        {categories.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {categories.map((cat: any, index: number) => {
              const colors = ['bg-yellow-100', 'bg-green-100', 'bg-blue-100', 'bg-pink-100', 'bg-purple-100'];
              const bgColor = colors[index % colors.length];

              return (
                <Link
                  key={cat.category._id}
                  href={`/${serviceName}/${serviceId}/${cat.category.name.toLowerCase()}/${cat.category._id}`}
                >
                  <div
                    className={`flex items-center justify-center h-28 sm:h-36 md:h-40 rounded-lg border hover:shadow-lg transition ${bgColor}`}
                  >
                    <h2 className="font-semibold text-sm sm:text-base md:text-lg text-center px-2">
                      {cat.category.name}
                    </h2>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold mb-4">No categories found!</h2>
            <Link
              href="/"
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              Back to Home
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
