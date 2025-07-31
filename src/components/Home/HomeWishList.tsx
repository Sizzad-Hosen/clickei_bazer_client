'use client';

import { useGetWishlistQuery } from '@/redux/features/WishList/wishListApi';
import ProductCard from '@/components/Products/ProductCard';
import Spinner from '../Spinner';

export default function WishlistHome() {
  const { data: wishlistData, isLoading } = useGetWishlistQuery({});
  const wishlistProducts = wishlistData?.data?.map((item: any) => item.product) || [];

  return (
    <section className="mt-10 space-y-4">
      <h3 className="text-xl font-semibold">Your Faverite</h3>

      {isLoading ? (
        <Spinner />
      ) : wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlistProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} onOpenCart={() => {}} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      )}
    </section>
  );
}
