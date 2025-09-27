"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Spinner from "@/components/Spinner";
import ProductCard from "@/components/Products/ProductCard";
import CartDrawer from "@/components/Carts/CartDrawer";
import Sidebar from "@/components/shared/Sidebar";
import { useLazyServiceHomeFullTreeQuery } from "@/redux/features/Services/serviceApi";
import { useGetAllProductsBySubcategoryIdQuery } from "@/redux/features/Products/productApi";
import { TMeta } from "@/types/global";
import { Product } from "@/types/products";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Type definitions
interface Subcategory {
  subcategory: {
    _id: string;
    name: string;
  };
}

interface CategoryResponse {
  data: {
    categories: {
      category: { _id: string; name: string };
      subcategories: Subcategory[];
    }[];
  };
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.serviceId as string;
  const categoryId = params?.categoryId as string;
  const categoryName = params?.categoryName as string;

  const [fetchFullTree, { isFetching }] = useLazyServiceHomeFullTreeQuery();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  // Fetch subcategories
  const fetchSubcategories = useCallback(async () => {
    if (!serviceId || !categoryId) return;
    try {
      const res: CategoryResponse = await fetchFullTree(serviceId).unwrap();
      const category = res.data.categories.find((cat) => cat.category._id === categoryId);
      if (category) {
        setSubcategories(category.subcategories || []);
        if (category.subcategories.length > 0) {
          setSelectedSubcategoryId((prev) => prev || category.subcategories[0].subcategory._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [serviceId, categoryId, fetchFullTree]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  // Fetch products
  const { data: productsData, isLoading: productsLoading } = useGetAllProductsBySubcategoryIdQuery(
    { subcategoryId: selectedSubcategoryId || "", page, limit: 16 },
    { skip: !selectedSubcategoryId }
  );

  const meta: TMeta = productsData?.meta || { total: 0, page: 1, limit: 16, totalPages: 1 };
  const totalPages = meta.totalPages;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (isFetching) return <Spinner />;

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh]">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r bg-gray-50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 ms-6 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
          All {categoryName} Subcategories
        </h1>

        {/* Subcategories */}
        <div className="flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {subcategories.map((sub) => (
            <button
              key={sub.subcategory._id}
              onClick={() => {
                setSelectedSubcategoryId(sub.subcategory._id);
                setPage(1);
              }}
              className={`flex-shrink-0 border border-amber-400 px-4 py-2 rounded-lg transition text-sm sm:text-base ${
                selectedSubcategoryId === sub.subcategory._id
                  ? "bg-gray-300 font-semibold"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {sub.subcategory.name}
            </button>
          ))}
        </div>

        {/* Products */}
        {productsLoading ? (
          <Spinner />
        ) : productsData?.data?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {productsData.data.map((product: Product) => (
              <div key={product._id} className="flex justify-center items-stretch">
                <div className="w-full bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col">
                  <ProductCard product={product} onOpenCart={openCart} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-4">No products found!</h2>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>

            {getPageNumbers().map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "secondary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Cart Drawer */}
        <CartDrawer open={cartOpen} onClose={closeCart} />
      </main>
    </div>
  );
}
