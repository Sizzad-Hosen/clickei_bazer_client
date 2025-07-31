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
import { useAddToWishlistMutation, useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/redux/features/WishList/wishListApi';

interface Props {
  product: Product;
  onOpenCart: () => void;
}

export default function ProductCard({ product, onOpenCart }: Props) {
  const [addCart, { isLoading: isAddingToCart }] = useAddCartMutation();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isInWishlist = wishlistData?.data?.some(
    (item: any) => item.product._id === product._id
  );

  const handleAddToCart = async () => {
    try {
      await addCart({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || '/placeholder.png',
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
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-100"
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
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-10"
              onClick={() => setIsDetailsOpen(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
            <Button
              className="flex-1 h-10"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex justify-between items-start">
            <DialogTitle className="text-2xl">{product.title}</DialogTitle>
            <button
              onClick={handleToggleWishlist}
              className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              {isInWishlist ? (
                <Heart className="text-red-500 h-5 w-5" />
              ) : (
                <HeartOff className="text-gray-400 h-5 w-5" />
              )}
            </button>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Price</h3>
                <p className="text-2xl font-bold text-primary">
                  ৳{product.price}
                </p>
              </div>

              <div className="pt-4">
                <Button
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
        </DialogContent>
      </Dialog>
    </>
  );
}
