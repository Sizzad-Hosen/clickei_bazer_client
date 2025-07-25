'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useGetAllProductsBySubcategoryIdQuery } from '@/redux/features/Products/productApi';
import ProductCard from '@/components/Products/ProductCard';
import Sidebar from '@/components/shared/Sidebar';
import { Button } from '@/components/ui/button';
import CartDrawer from '@/components/Carts/CartDrawer'; // ✅ Make sure the path is correct

const ProductListBySubcategory = () => {
  const params = useParams();
  const subcategoryId = params ? params['subcategoryId'] : undefined;

  const [page, setPage] = useState(1);
  const [cartOpen, setCartOpen] = useState(false); // ✅ drawer state
  const limit = 10;

  const {
    data: productRes,
    isLoading,
    error,
  } = useGetAllProductsBySubcategoryIdQuery(
    { subcategoryId: subcategoryId?.toString(), page, limit },
    {
      skip: !subcategoryId,
    }
  );

  const products = productRes?.data?.products || [];
  const meta = productRes?.data?.meta;

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

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
              <ProductCard key={product._id} product={product} onOpenCart={openCart} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-gray-600 font-medium">
              Page {page} of {meta?.totalPages || 1}
            </span>
            <Button
              onClick={() => {
                if (page < meta?.totalPages) setPage((prev) => prev + 1);
              }}
              disabled={page === meta?.totalPages}
            >
              Next
            </Button>
          </div>
        </main>
      </div>

      {/* ✅ Drawer visible globally */}
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </div>
  );
};

export default ProductListBySubcategory;
