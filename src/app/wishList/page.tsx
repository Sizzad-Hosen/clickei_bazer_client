// src/app/(user)/wishlist/page.tsx

'use client';


import { Button } from '@/components/ui/button';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/redux/features/WishList/wishListApi';
import { Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const { data, isLoading, isError } = useGetWishlistQuery(undefined);

  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  if (isLoading) return <p className="text-center py-8">Loading wishlist...</p>;
  if (isError || !data?.data?.length) return <p className="text-center py-8">No items in your wishlist.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {data.data.map((item: any) => (
          <div key={item._id} className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">{item.product?.name || 'Unnamed Product'}</h3>
              <p className="text-sm text-gray-500 mt-2">{item.product?.description?.slice(0, 80)}...</p>
              <p className="text-sm text-gray-700 mt-2 font-medium">Price: ${item.product?.price}</p>
            </div>
            <Button
              variant="destructive"
              className="mt-4"
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
