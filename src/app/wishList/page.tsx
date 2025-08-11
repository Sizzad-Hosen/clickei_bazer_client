'use client';

import { Button } from '@/components/ui/button';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/redux/features/WishList/wishListApi';
import { Trash2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
}

interface WishlistItem {
  _id: string;
  product: Product;
}

export default function WishlistPage() {
  const { data, isLoading, isError } = useGetWishlistQuery(undefined);
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  if (isLoading) return <p className="text-center py-8">Loading wishlist...</p>;
  if (isError || !data?.data?.length) return <p className="text-center py-8">No items in your wishlist.</p>;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center sm:text-left">Your Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.data.map((item: WishlistItem) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
          >
            <div>
              <h3 className="text-lg font-semibold truncate">{item.product?.name || 'Unnamed Product'}</h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                {item.product?.description || 'No description available.'}
              </p>
              <p className="text-sm text-gray-700 mt-3 font-medium">Price: ${item.product?.price}</p>
            </div>
            <Button
              variant="destructive"
              className="mt-5"
              onClick={() => removeFromWishlist(item.product._id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
