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
  const limit = 16;

  const {
    data,
    error,
    isLoading,
    isFetching,
  } = useGetAllRecentProductsBySubcategoryQuery({ page, limit });

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-center py-12 text-red-600">Failed to load products.</div>;

  const products = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || 1;

  // Pagination numbers
  const getPageNumbers = () => {
   const pages: number[] = [];
    const maxVisible = 5; // max numbered pages to show
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="max-w-8xl mx-auto px-4 py-8">
      <h2 className="font-bold p-5 text-2xl">Recommended Products for you</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map(product => (
            <ProductCard key={product._id} product={product} onOpenCart={onOpenCart} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <nav aria-label="Pagination" className="flex items-center justify-center space-x-2 mt-12 flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={page === 1 || isFetching}
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {getPageNumbers().map((pageNumber) => (
          <Button
            key={`page-${pageNumber}`}
            variant={pageNumber === page ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}

        <Button
          variant="outline"
          disabled={page >= totalPages || isFetching}
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
};

export default ProductsBySubcategoryPage;
