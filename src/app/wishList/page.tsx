'use client';

import { Button } from '@/components/ui/button';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/redux/features/WishList/wishListApi';
import { Trash2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FeedbackState } from '@/components/shared/FeedbackState';

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

function WishlistContent() {
  const { data, isLoading, isError, refetch } = useGetWishlistQuery(undefined);
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

  if (isLoading) {
    return <p className="text-center py-8">Loading wishlist...</p>;
  }

  if (isError) {
    return <FeedbackState tone="error" title="Could not load your wishlist" description="Check your connection and try again." onRetry={refetch} />;
  }

  if (!data?.data?.length) {
    return <FeedbackState title="Your wishlist is empty" description="Products you save will appear here." />;
  }

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
              <h3 className="text-lg font-semibold truncate">
                {item.product?.name || 'Unnamed Product'}
              </h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                {item.product?.description || 'No description available.'}
              </p>
              <p className="text-sm text-gray-700 mt-3 font-medium">
                Price: ${item.product?.price}
              </p>
            </div>
            <Button
              variant="destructive"
              className="mt-5"
              disabled={isRemoving}
              onClick={() => void removeFromWishlist(item.product._id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}
