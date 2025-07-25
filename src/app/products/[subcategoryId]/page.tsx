'use client';

import { useParams } from 'next/navigation';
import { useGetAllProductsBySubcategoryIdQuery, useGetAllProductsQuery } from '@/redux/features/Products/productApi';
import Sidebar from '@/components/shared/Sidebar';
import ProductCard from '@/components/Products/ProductCard';

const ProductListBySubcategory = () => {

  const { subcategoryId } = useParams();


console.log('Subcategory ID:', subcategoryId);

  const {
    data: productRes,
    isLoading,
    error,
  } = useGetAllProductsBySubcategoryIdQuery(subcategoryId as string, {
    skip: !subcategoryId,
  });

  const products =
    productRes?.data && Array.isArray(productRes.data)
      ? productRes.data
      : [];

      console.log('Products:', products);

  return (
    <div className="min-h-screen flex flex-col">
     
      <div className="flex flex-1">
        <Sidebar onSelectSubcategory={() => {}} />

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Products</h2>

          {isLoading && <p>Loading products...</p>}
          {error && <p className="text-red-500">Error loading products</p>}

          {!isLoading && products.length === 0 && (
            <p className="text-gray-500 italic">No products found.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </main>
      </div>
   
    </div>
  );
};

export default ProductListBySubcategory;