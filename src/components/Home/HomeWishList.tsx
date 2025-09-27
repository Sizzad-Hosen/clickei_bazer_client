'use client';

import { useGetWishlistQuery } from '@/redux/features/WishList/wishListApi';
import ProductCard from '@/components/Products/ProductCard';
import Spinner from '../Spinner';
import type { Product } from '@/types/products';  // make sure this path is correct

interface WishlistItem {
  _id: string;
  product: Product | null;
}

interface WishlistHomeProps {
  onOpenCart: () => void;
}

export default function WishlistHome({ onOpenCart }: WishlistHomeProps) {
  const { data: wishlistData, isLoading } = useGetWishlistQuery({});

  // Extract products safely, filtering out null or undefined products
  const wishlistProducts: Product[] =
    wishlistData?.data
      ?.map((item: WishlistItem) => item.product)
      ?.filter((product): product is Product => Boolean(product && product._id)) || [];

  return (
    <section className="mt-10 space-y-4">
      <h3 className="font-bold p-3 text-2xl">Your Favorite</h3>

      {isLoading ? (
        <Spinner />
      ) : wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlistProducts.map((product: Product) => (
            <ProductCard
              key={product._id}
              product={{
                ...product,
                description: product.description ?? '', // ensure description is string
              }}
              onOpenCart={onOpenCart}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      )}
    </section>
  );
}
