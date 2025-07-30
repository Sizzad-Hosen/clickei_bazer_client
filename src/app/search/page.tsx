'use client';

import { useSearchParams } from 'next/navigation';
import { useGetAllProductsBySearchQuery } from '@/redux/features/Products/productApi';
import ProductCard from '@/components/Products/ProductCard';

const SearchPage = () => {
  const searchParams = useSearchParams();

  // Extract query param key-value pair (e.g., ?title=milk)
  const getFieldAndValue = () => {
    const entries = Array.from(searchParams.entries());
    if (entries.length > 0) {
      return { field: entries[0][0], value: entries[0][1] };
    }
    return { field: '', value: '' };
  };

  const { field, value: searchTerm } = getFieldAndValue();
  const queryParams = field && searchTerm ? { [field]: searchTerm } : {};

  const { data, isLoading, isError } = useGetAllProductsBySearchQuery(queryParams, {
    skip: !searchTerm,
  });

  const result = data?.data?.data || [];

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="mb-6 text-2xl font-semibold">
        Search Results for &quot;{searchTerm}&quot; in &quot;{field}&quot;
      </h1>

      {isLoading ? (
        <p className="text-blue-500">Loading search results...</p>
      ) : isError ? (
        <p className="text-red-500">Error loading products.</p>
      ) : result.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {result.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No products found matching &quot;{searchTerm}&quot;.</p>
      )}
    </main>
  );
};

export default SearchPage;
