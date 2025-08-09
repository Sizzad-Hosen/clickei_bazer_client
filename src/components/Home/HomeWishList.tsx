'use client';

import { useGetWishlistQuery } from '@/redux/features/WishList/wishListApi';
import ProductCard from '@/components/Products/ProductCard';
import Spinner from '../Spinner';

interface WishlistHomeProps {
  onOpenCart: () => void;
}

export default function WishlistHome({ onOpenCart }: WishlistHomeProps) {
  const { data: wishlistData, isLoading } = useGetWishlistQuery({});

  // Safely extract products, filtering out null/undefined ones
  const wishlistProducts =
    wishlistData?.data
      ?.map((item: any) => item?.product)
      ?.filter((p: any) => p && p._id) || [];

  return (
    <section className="mt-10 space-y-4">
      <h3 className="text-xl font-semibold">Your Favorite</h3>

      {isLoading ? (
        <Spinner />
      ) : wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlistProducts.map((product: any) => (
            <ProductCard
              key={product._id}
              product={product}
              onOpenCart={onOpenCart} // Pass down onOpenCart prop
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      )}
    </section>
  );
}
