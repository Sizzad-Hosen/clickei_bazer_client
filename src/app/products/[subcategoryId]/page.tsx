'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

import { useGetAllProductsBySubcategoryIdQuery } from '@/redux/features/Products/productApi';
import {
  useLazyServiceFullTreeQuery,
  useGetSingelServicesQuery,
} from '@/redux/features/Services/serviceApi';

import ProductCard from '@/components/Products/ProductCard';
import Sidebar from '@/components/shared/Sidebar';
import CartDrawer from '@/components/Carts/CartDrawer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category, Subcategory, Product } from '@/types/products';

type BreadcrumbItem = {
  id: string;
  name: string;
  type: 'service' | 'category' | 'subcategory';
};

const ProductListBySubcategory = () => {
  const params = useParams();
  const subcategoryId = typeof params?.subcategoryId === 'string' ? params.subcategoryId : '';

console.log("sub id", subcategoryId)

  const [page, setPage] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const limit = 10;

  const { data: productRes, isLoading, isError } = useGetAllProductsBySubcategoryIdQuery(
    { subcategoryId, page, limit },
    { skip: !subcategoryId }
  );

  // useMemo to avoid array recreation every render
  const products: Product[] = useMemo(() => productRes?.data || [], [productRes?.data]);

  console.log("product", productRes)
  
  const meta = productRes?.meta;
  const totalPages = meta?.totalPages || 1;

  const serviceId = products.length > 0 ? products[0]?.serviceId || '' : '';

  const { data: singleServiceData } = useGetSingelServicesQuery(
    { serviceId },
    { skip: !serviceId }
  );

  const [fetchFullTree] = useLazyServiceFullTreeQuery();

  useEffect(() => {
    if (!serviceId || !subcategoryId || breadcrumbs.length > 0) return;

    fetchFullTree(serviceId).then(({ data }) => {
      const service = data?.data;
      if (!service) return;

      const categoryId =
        typeof products[0]?.categoryId === 'string'
          ? products[0]?.categoryId
          : products[0]?.categoryId?._id;

      const category = service.categories.find(
        (cat: Category) => cat.category?._id === categoryId
      );

      const subcategory = category?.subcategories?.find(
        (sub: Subcategory) => sub.subcategory?._id === subcategoryId
      );

      if (service && category && subcategory) {
        setBreadcrumbs([
          {
            id: singleServiceData?.data?._id || service._id,
            name: singleServiceData?.data?.name || service.name,
            type: 'service',
          },
          {
            id: category.category?._id || '',
            name: category.category?.name || '',
            type: 'category',
          },
          {
            id: subcategory.subcategory?._id || '',
            name: subcategory.subcategory?.name || '',
            type: 'subcategory',
          },
        ]);
      }
    });
  }, [
    serviceId,
    subcategoryId,
    products,  // this is stable now because of useMemo
    fetchFullTree,
    breadcrumbs.length,
    singleServiceData,
  ]);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!subcategoryId) {
    return <div>Invalid or missing subcategoryId</div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row md:flex-row bg-white gap-6 overflow-hidden">
      <div className="flex flex-1">
        <aside className="md:w-64 border-r min-h-screen ">
          <Sidebar onSelectSubcategory={() => {}} />
        </aside>

        <main className="flex-1 ms-6 p-4 md:p-6">
          {breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="flex items-center text-sm text-gray-600 mb-4 flex-wrap gap-1"
            >
              {breadcrumbs.map((item, index) => (
                <div key={item.id} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-primary">{item.name}</span>
                  ) : (
                    <Link
                      href={`/${item.type}s/${item.id}`}
                      className="hover:text-primary cursor-pointer"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          )}

          <h2 className="text-2xl font-bold mb-6">Products</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 10 }).map((_, idx) => (
                <Skeleton key={idx} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-red-500">Failed to load products</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 italic">No products found in this subcategory</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} onOpenCart={openCart} />
              ))}
            </div>
          )}

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
        </main>
      </div>

      <CartDrawer open={cartOpen} onClose={closeCart} />
    </div>
  );
};

export default ProductListBySubcategory;
