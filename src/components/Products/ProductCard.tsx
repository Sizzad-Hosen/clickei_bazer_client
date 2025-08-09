'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ShoppingCart, Eye, Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Product } from '@/types/products';
import { useAddCartMutation } from '@/redux/features/AddToCart/addToCartApi';
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from '@/redux/features/WishList/wishListApi';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentToken } from '@/redux/features/auth/authSlices';
import { useRouter } from 'next/navigation';

interface Props {
  product: Product;
  recommendedProducts?: Product[]; // pass recommended products as prop or fetch inside modal
  onOpenCart: () => void;
}

export default function ProductCard({
  product,
  recommendedProducts = [],
  onOpenCart,
}: Props) {
  const [addCart, { isLoading: isAddingToCart }] = useAddCartMutation();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

const isInWishlist = wishlistData?.data?.some(
  (item: any) => item.product && item.product._id === product?._id
);

  const token = useAppSelector(selectCurrentToken);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('You must be logged in to add items to the cart.');
      router.push('/login');
      return;
    }

    try {
      await addCart({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || '/avatar-placeholder.png',
      }).unwrap();

      toast.success('Added to cart');
      onOpenCart();
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product._id).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Wishlist action failed');
    }
  };

  return (
    <>
      <div className="relative rounded-lg border bg-white shadow-sm hover:shadow-md transition-all w-full h-full flex flex-col">
        {/* Wishlist Icon Top-Right */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist ? (
            <Heart className="text-red-500 h-5 w-5" />
          ) : (
            <HeartOff className="text-gray-400 h-5 w-5" />
          )}
        </button>

        {/* Product Image */}
        <motion.div
          className="relative aspect-square w-full bg-gray-100 overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Image
            src={product.images?.[0] || '/avatar-placeholder.png'}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={true} // preload main image for better UX
          />
        </motion.div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="font-medium text-lg line-clamp-1 mb-1">
              {product.title}
            </h3>
            <p className="text-gray-600 font-bold text-xl mb-3">৳{product.price}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-col xl:flex-row lg:flex-row gap-2 sm:flex-row sm:gap-3 md:gap-4">
            <Button
              variant="outline"
              className="w-full sm:flex-1 h-10"
              onClick={() => setIsDetailsOpen(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:flex-1 h-10"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="h-4 w-4 md:mr-0 md:m-2 mr-2" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="flex justify-between items-start">
            <DialogTitle className="text-2xl">{product.title}</DialogTitle>

            <button
              onClick={handleToggleWishlist}
              className="bg-white rounded-full p-1 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist ? (
                <Heart className="text-red-500 h-5 w-5" />
              ) : (
                <HeartOff className="text-gray-400 h-5 w-5" />
              )}
            </button>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
  <Image
    src={product.images?.[0] ? product.images[0] : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2U2akySBgSHUK-foX-9SGFmLk6zEuGYNNqw&s'}
    alt={product.title || 'Avatar'}
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
    priority={true}
  />
</div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Price</h3>
                <p className="text-2xl font-bold text-primary">৳{product.price}</p>
              </div>

              <div className="pt-4">
                <Button
                  variant="secondary"
                  className="w-full h-12"
                  onClick={() => {
                    handleAddToCart();
                    setIsDetailsOpen(false);
                  }}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>

          {/* More Images Section */}
          {product?.images?.length > 1 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">More Images</h3>
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-md overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Products Section */}
          {recommendedProducts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Recommended Products</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {recommendedProducts.map((recProd) => (
                  <div
                    key={recProd._id}
                    className="border rounded-lg p-3 hover:shadow-md cursor-pointer"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      router.push(`/products/${recProd._id}`);
                    }}
                  >
                    <div className="relative aspect-square w-full bg-gray-100 rounded-md overflow-hidden mb-2">
                      <Image
                        src={recProd.images?.[0] || '/avatar-placeholder.png'}
                        alt={recProd.title}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                    <p className="text-sm font-medium line-clamp-2">{recProd.title}</p>
                    <p className="text-sm font-semibold text-primary">৳{recProd.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
