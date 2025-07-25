'use client';

import { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import { useGetAllProductsQuery } from '@/redux/features/Products/productApi';
import ProductCard from '../Products/ProductCard';

export const Home = () => {
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);

  const {
    data: productRes,
    isLoading,
    error,
  } = useGetAllProductsQuery(selectedSubcategoryId!, {
    skip: !selectedSubcategoryId,
  });
const products = productRes?.data?.data && Array.isArray(productRes.data.data)
  ? productRes.data.data
  : [];


  return (
    <div className="min-h-screen flex flex-col">
  

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar with subcategory selection */}
        <Sidebar onSelectSubcategory={setSelectedSubcategoryId} />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

          {/* Subcategory not selected */}
          {!selectedSubcategoryId && (
            <p className="text-gray-500 text-lg">
              Please select a subcategory from the sidebar to view products.
            </p>
          )}

          {/* Loading */}
          {isLoading && selectedSubcategoryId && (
            <p className="text-gray-600">Loading products...</p>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-500">Failed to load products. Please try again later.</p>
          )}

          {/* Product Grid */}
          {selectedSubcategoryId && !isLoading && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* No products found */}
          {selectedSubcategoryId && !isLoading && products.length === 0 && (
            <p className="text-gray-500">No products found in this subcategory.</p>
          )}
        </main>
      </div>

    </div>
  );
};
