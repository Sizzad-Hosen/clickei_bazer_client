'use client';

import { useState } from 'react';
import { useGetAllProductsQuery } from '@/redux/features/Products/productApi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import Spinner from '@/components/Spinner';
import { Product } from '@/types/products';
import { Eye, Pencil } from 'lucide-react';

const PAGE_SIZE = 10;

const ProductsListPage = () => {

  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetAllProductsQuery({ page, limit: PAGE_SIZE });

  

 const products = data?.data
const meta = data?.meta;


  if (isLoading) return <Spinner></Spinner>
  if (isError) return <p className="text-center text-red-500">Failed to load products</p>;
  if (!Array.isArray(products) || products.length === 0) return <p className="text-center">No products found.</p>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <Card key={product._id} className="rounded-2xl border shadow-md">
            <CardHeader>
              <div className="h-48 w-full relative overflow-hidden rounded-lg">
                <Image
                  src={product.images?.[0] || '/no-image.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
              <p className="text-sm text-muted-foreground">{product.title}</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              <p className="font-semibold text-amber-600">৳ {product.price}</p>
          

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href={`/dashboard/products/${product._id}`}>
                  <Button variant="outline" className="w-full gap-2">
                    <Eye className="h-4 w-4" /> Details
                  </Button>
                </Link>
                <Link href={`/dashboard/products/${product._id}?action=edit`}>
                  <Button variant="secondary" className="w-full gap-2">
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      
      {meta && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {meta.page} of {meta.totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === meta.totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsListPage;
