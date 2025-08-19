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
import { useAddCartMutation, useGetAllCartsQuery } from '@/redux/features/AddToCart/addToCartApi';
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
  recommendedProducts?: Product[]; // optional recommended products
  onOpenCart: () => void;
}

interface WishlistItem {
  _id: string;
  product: Product | null;
}

export default function ProductCard({
  product,
  recommendedProducts = [],
  onOpenCart,
}: Props) {
  const [addCart, { isLoading: isAddingToCart }] = useAddCartMutation();
  const { refetch } = useGetAllCartsQuery({}); // ✅ from the query hook
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const router = useRouter();
  const token = useAppSelector(selectCurrentToken);

  // Determine if the product is in wishlist
  const isInWishlist = wishlistData?.data?.some(
    (item: WishlistItem) => item.product?._id === product._id
  );

  // Calculate discounted price
  const discountedPrice =
    product.discount && product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

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
        image:
          product.images?.[0] ??
          'https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg',
      }).unwrap();
      toast.success('Added to cart');

          // Force re-fetch updated cart data
    refetch();

      onOpenCart();
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!token) {
      toast.error('You must be logged in to manage favorites.');
      router.push('/login');
      return;
    }

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
      console.error(error);
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
          type="button"
        >
          {isInWishlist ? (
            <Heart className="text-red-500 h-5 w-5" />
          ) : (
            <HeartOff className="text-gray-400 h-5 w-5" />
          )}
        </button>

        {/* Discount Badge Top-Left */}
        {product.discount && product.discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md select-none">
            {product.discount}% OFF
          </div>
        )}

        {/* Product Image */}
        <motion.div
          className="relative aspect-square w-full bg-gray-100 overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Image
            src={
              product.images?.[0] ??
              'https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg'
            }
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={true}
          />
        </motion.div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="font-medium text-lg line-clamp-1 mb-1">{product.title}</h3>
            <div className="flex flex-col lg:flex-row md:flex-row xl:flex-row items-center gap-2">
              {product.discount && product.discount > 0 ? (
                <>
                  <span className="text-red-600 font-bold text-xl">
                    ৳{discountedPrice.toFixed(2)}
                  </span>
                  <span className="line-through text-gray-400  text-sm">
                    ৳{product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-bold text-xl">৳{product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col pt-2 md:flex-col xl:flex-row lg:flex-row gap-2 sm:flex-row sm:gap-3 md:gap-4">
            <Button
              variant="outline"
              className="w-full sm:flex-1 h-10"
              onClick={() => setIsDetailsOpen(true)}
              type="button"
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:flex-1 h-10"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              type="button"
            >
              <ShoppingCart className="h-4 w-4 md:mr-0 md:m-2 mr-2" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>

   {/* Product Details Modal */}
<Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
  <DialogContent className="sm:max-w-3xl lg:max-w-5xl max-h-[95vh] overflow-y-auto p-6 rounded-2xl shadow-xl">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT SIDE - MAIN IMAGE */}
      <div className="flex flex-col items-center">
        <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={
              product.images?.[0]
                ? product.images[0]
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2U2akySBgSHUK-foX-9SGFmLk6zEuGYNNqw&s"
            }
            alt={product.title || "Product"}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Thumbnails (More Images) */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {product.images.map((img, i) => (
              <div
                key={i}
                className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500"
                onClick={() => {
                  // Replace main image logic if needed
                }}
              >
                <Image
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE - DETAILS */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {product.title}
          </DialogTitle>
          <button
            onClick={handleToggleWishlist}
            className="bg-white rounded-full p-2  pt-2 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
            type="button"
          >
            {isInWishlist ? (
              <Heart className="text-red-500 h-6 w-6" />
            ) : (
              <HeartOff className="text-gray-400 h-6 w-6" />
            )}
          </button>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description ?? "No description available."}
          </p>
        </div>

        {/* Price */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Price</h3>
          <div className="flex items-center gap-3">
            {product.discount && product.discount > 0 ? (
              <>
                <span className="text-red-600 font-bold text-3xl">
                  ৳{discountedPrice.toFixed(2)}
                </span>
                <span className="line-through text-gray-400 text-lg">
                  ৳{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-bold text-3xl">
                ৳{product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            variant="secondary"
            className="flex-1 h-12 text-lg"
            onClick={() => {
              handleAddToCart();
              setIsDetailsOpen(false);
            }}
            disabled={isAddingToCart}
            type="button"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>

        </div>
      </div>
    </div>

    {/* Recommended Products */}
    {recommendedProducts.length > 0 && (
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Recommended Products</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {recommendedProducts.map((recProd) => (
            <div
              key={recProd._id}
              className="border rounded-lg p-3 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                setIsDetailsOpen(false);
                router.push(`/products/${recProd._id}`);
              }}
            >
              <div className="relative aspect-square w-full bg-gray-100 rounded-md overflow-hidden mb-2">
                <Image
                  src={recProd.images?.[0] || "/avatar-placeholder.png"}
                  alt={recProd.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm font-medium line-clamp-2">
                {recProd.title}
              </p>
              <p className="text-sm font-semibold text-primary">
                ৳{recProd.price}
              </p>
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
