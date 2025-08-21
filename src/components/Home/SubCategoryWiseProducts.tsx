'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import ProductCard from '../Products/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '../Spinner';
import { useGetAllRecentProductsBySubcategoryQuery } from '@/redux/features/Products/productApi';

interface ProductsBySubcategoryPageProps {
   
  onOpenCart: () => void;
}



const ProductsBySubcategoryPage: React.FC<ProductsBySubcategoryPageProps> = ({
  onOpenCart,
}) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data,
    error,
    isLoading,
    isFetching,
  } = useGetAllRecentProductsBySubcategoryQuery({
    page,
    limit,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-center py-12 text-red-600">Failed to load products.</div>;


  
  const products = data?.data ?? [];
  console.log("data", data)
  const meta = data?.meta;

  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      <h2 className='font-bold p-5 text-2xl '>Recommended Products for you</h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onOpenCart={onOpenCart}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <nav
        aria-label="Pagination"
        className="flex items-center justify-center space-x-6 mt-12"
      >
        <Button
          variant="outline"
          disabled={page === 1 || isFetching}
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          className="flex items-center space-x-2"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <span
          className="text-gray-700 font-medium select-none"
          tabIndex={-1}
          aria-current="page"
        >
          Page {page} {meta?.totalPages ? `of ${meta.totalPages}` : ''}
        </span>

        <Button
          variant="outline"
          disabled={meta ? page >= meta.totalPages || isFetching : true}
          onClick={() => setPage(p => p + 1)}
          className="flex items-center space-x-2"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
};

export default ProductsBySubcategoryPage;
