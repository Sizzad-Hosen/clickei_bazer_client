'use client';

import { useSearchParams } from 'next/navigation';
import { useGetAllProductsBySearchQuery } from '@/redux/features/Products/productApi';
import ProductCard from '@/components/Products/ProductCard';
import Sidebar from '@/components/shared/Sidebar';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import CartDrawer from '@/components/Carts/CartDrawer';

const SearchPage = () => {
  const searchParams = useSearchParams();

  const getFieldAndValue = () => {
    const entries = Array.from(searchParams.entries());
    if (entries.length > 0) {
      return { field: entries[0][0], value: entries[0][1] };
    }
    return { field: '', value: '' };
  };

  const { field, value: searchTerm } = getFieldAndValue();
  const [page, setPage] = useState(1);

  // Build query params with search term and page
  const queryParams = field && searchTerm
    ? { [field]: searchTerm, page: String(page) }
    : { page: String(page) };

  const { data, isLoading, isError } = useGetAllProductsBySearchQuery(queryParams, {
    skip: !searchTerm,
  });

  const result = data?.data?.data || [];
  const meta = data?.data?.meta;
  const totalPages = meta?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
    const [cartOpen, setCartOpen] = useState(false);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);


  return (
    <main className="min-h-screen flex flex-col lg:flex-row md:flex-row bg-white gap-6 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r shadow-sm md:block">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <section className="flex-1 px-3 sm:px-6 py-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : isError ? (
          <p className="text-red-500">Something went wrong while loading products.</p>
        ) : result.length === 0 ? (
          <p className="text-gray-600 text-center mx-auto text-lg font-medium">
            No products found for "{searchTerm}"
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {result.map((product: any) => (
                <div
                  key={product._id}
                  className="w-84 h-[360px] sm:h-[400px] lg:h-[420px] bg-white shadow-md rounded-md overflow-hidden"
                >
                  <ProductCard 
                    key={product._id}
                  product={product}
                  onOpenCart={openCart}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="sr-only md:not-sr-only">Previous</span>
              </Button>

              <span className="text-sm text-gray-600 font-medium px-3">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <span className="sr-only md:not-sr-only">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </section>
      
            {/* Cart Drawer */}
            <CartDrawer open={cartOpen} onClose={closeCart} />
    </main>
  );
};

export default SearchPage;
