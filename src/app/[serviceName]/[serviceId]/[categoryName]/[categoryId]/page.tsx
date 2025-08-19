'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Spinner from '@/components/Spinner';
import ProductCard from '@/components/Products/ProductCard';
import CartDrawer from '@/components/Carts/CartDrawer';
import Sidebar from '@/components/shared/Sidebar';
import { useLazyServiceHomeFullTreeQuery } from '@/redux/features/Services/serviceApi';
import { useGetAllProductsBySubcategoryIdQuery } from '@/redux/features/Products/productApi';
import { TMeta } from '@/types/global';

export default function CategoryPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;
  const categoryId = params?.categoryId as string;
  const categoryName = params?.categoryName as string;

  const [fetchFullTree, { isFetching }] = useLazyServiceHomeFullTreeQuery();
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const fetchSubcategories = useCallback(async () => {
    if (!serviceId || !categoryId) return;
    try {
      const res: any = await fetchFullTree(serviceId).unwrap();
      const category = res?.data?.categories?.find(
        (cat: any) => cat.category._id === categoryId
      );
      if (category) {
        setSubcategories(category.subcategories || []);
        // Always select first subcategory if none selected
        if (category.subcategories.length > 0) {
          setSelectedSubcategoryId((prev) =>
            prev ? prev : category.subcategories[0].subcategory._id
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [serviceId, categoryId, fetchFullTree]);

  // Fetch subcategories on mount or when service/category changes
  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  // Fetch products when subcategory or page changes
  const { data: productsData, isLoading: productsLoading } =
    useGetAllProductsBySubcategoryIdQuery(
      { subcategoryId: selectedSubcategoryId || '', page, limit: 6 },
      { skip: !selectedSubcategoryId }
    );

  const meta: TMeta | undefined = productsData?.meta;

  if (isFetching) return <Spinner />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r bg-gray-50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 ms-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          All {categoryName} Subcategories
        </h1>

        {/* Subcategories Buttons */}
        <div className="flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {subcategories.map((sub: any) => (
            <button
              key={sub.subcategory._id}
              onClick={() => {
                setSelectedSubcategoryId(sub.subcategory._id);
                setPage(1); // Reset page on new subcategory
              }}
              className={`flex-shrink-0 border border-amber-400 px-4 py-2 rounded-lg transition text-sm sm:text-base ${
                selectedSubcategoryId === sub.subcategory._id
                  ? 'bg-gray-300 font-semibold'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {sub.subcategory.name}
            </button>
          ))}
        </div>

        {/* Products */}
        {productsLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {productsData?.data?.map((product: any) => (
                <div key={product._id} className="flex justify-center items-stretch">
                  <div className="w-full bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col">
                    <ProductCard product={product} onOpenCart={openCart} />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta?.totalPages || 1 > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: meta?.totalPages || 1 }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 border rounded text-sm sm:text-base ${
                      page === i + 1 ? 'bg-gray-300 font-semibold' : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Cart Drawer */}
        <CartDrawer open={cartOpen} onClose={closeCart} />
      </main>
    </div>
  );
}
