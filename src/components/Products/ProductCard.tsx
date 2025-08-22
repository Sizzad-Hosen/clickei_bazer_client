'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ShoppingCart, Eye, Heart, HeartOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Product } from '@/types/products';
import { useAddCartMutation, useGetAllCartsQuery } from '@/redux/features/AddToCart/addToCartApi';
import { useAddToWishlistMutation, useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/redux/features/WishList/wishListApi';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentToken } from '@/redux/features/auth/authSlices';
import { useRouter } from 'next/navigation';
import ProductGallery from './ProductGallary';

interface Props {
  product: Product;
  recommendedProducts?: Product[];
  onOpenCart: () => void;
}

interface WishlistItem {
  _id: string;
  product: Product | null;
}

export default function ProductCard({ product, onOpenCart }: Props) {
  const [addCart, { isLoading: isAddingToCart }] = useAddCartMutation();
  const { refetch } = useGetAllCartsQuery({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? null);

  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);


  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const router = useRouter();
  const token = useAppSelector(selectCurrentToken);

  const isInWishlist = wishlistData?.data?.some((item: WishlistItem) => item.product?._id === product._id);

  const discountedPrice = selectedSize
    ? (selectedSize.price * (1 - (product.discount ?? 0) / 100)).toFixed(2)
    : product.price.toFixed(2);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('You must be logged in to add items to the cart.');
      router.push('/login');
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size.');
      return;
    }

    try {
      await addCart({
        productId: product._id,
        title: product.title,
        price: selectedSize.price,
        discount: product.discount ?? 0,
        quantity: 1,
        selectedSize: selectedSize,
        image: product.images?.[0] ?? '/avatar-placeholder.png',
      }).unwrap();

      toast.success('Added to cart');
      refetch();
      onOpenCart();
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!token) {
      toast.error('You must be logged in to manage wishlist.');
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
<div className="relative rounded-lg border bg-white shadow-sm hover:shadow-md transition-all w-full flex flex-col overflow-hidden">
  {/* Wishlist Icon Top-Right */}
  <button
    onClick={handleToggleWishlist}
    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    type="button"
  >
    {isInWishlist ? <Heart className="text-red-500 h-5 w-5" /> : <HeartOff className="text-gray-400 h-5 w-5" />}
  </button>

  {/* Discount Badge Top-Left */}
  {product.discount && product.discount > 0 && (
    <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md select-none">
      {product.discount}% OFF
    </div>
  )}

  {/* Product Image */}
  <motion.div
    className="relative w-full bg-gray-100 overflow-hidden aspect-[4/3] sm:aspect-square"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Image
      src={product.images?.[0] ?? "/placeholder.jpg"}
      alt={product.title}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      priority
    />
  </motion.div>

  {/* Product Info */}
  <div className="p-3 flex flex-col flex-1">

  <div className="flex justify-between items-center flex-nowrap mb-2">
  {/* Product Title */}
  <h3 className="font-medium text-base truncate">{product.title}</h3>

  {/* Stock Status */}
  <div className="flex-shrink-0">
    {product.stock ? (
      <span className="inline-block px-2 py-1 text-green-700 bg-green-100 text-xs font-semibold rounded">
        In Stock
      </span>
    ) : (
      <span className="inline-block px-2 py-1 text-red-700 bg-red-100 text-xs font-semibold rounded">
        Out of Stock
      </span>
    )}

</div>


    </div>

    {/* Price Section */}
    <div className="flex items-center gap-2 mb-2">
      {product.discount && product.discount > 0 ? (
        <>
          <span className="text-red-600 font-bold text-lg">৳{discountedPrice}</span>
          <span className="line-through text-gray-400 text-sm">৳{selectedSize?.price.toFixed(2)}</span>
        </>
      ) : (
        <span className="font-bold text-lg">৳{selectedSize?.price.toFixed(2)}</span>
      )}
    </div>

   
    {/* Select Size Button */}
    {product.sizes?.length > 0 && (
      <Button
        variant="outline"
        className="mb-3 w-full h-8 text-sm"
        onClick={() => setIsSizeModalOpen(true)}
      >
        {selectedSize ? `Size: ${selectedSize.label}` : "Select Size"}
      </Button>
    )}

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
      <Button
        variant="outline"
        className="w-full sm:w-1/2 h-8 sm:h-9 text-xs sm:text-sm"
        onClick={() => setIsDetailsOpen(true)}
        type="button"
      >
        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Details
      </Button>
      <Button
        variant="secondary"
        className="w-full sm:w-1/2 h-8 sm:h-9 text-xs sm:text-sm"
        onClick={handleAddToCart}
        disabled={isAddingToCart || !product.stock} // disable if out of stock
        type="button"
      >
        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
        {isAddingToCart ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  </div>

  {/* Size Selection Modal */}
  <Dialog open={isSizeModalOpen} onOpenChange={setIsSizeModalOpen}>
    <DialogContent className="sm:max-w-md rounded-xl">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">Select Size</DialogTitle>
      </DialogHeader>
      <div className="grid gap-3 mt-4">
        {product.sizes?.map((size, idx) => {
          const isActive = selectedSize?.label === size.label;
          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedSize(size);
                setIsSizeModalOpen(false);
              }}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg border text-sm font-medium transition ${
                isActive
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <span>{size.label}</span>
              <div className="flex items-center gap-2">
                <span>৳{size.price.toFixed(2)}</span>
                {isActive && <Check className="h-4 w-4 text-blue-600" />}
              </div>
            </button>
          );
        })}
      </div>
    </DialogContent>
  </Dialog>
</div>



      {/* Product Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-3xl lg:max-w-5xl max-h-[95vh] overflow-y-auto p-6 rounded-2xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Gallery */}
            <div className="flex flex-col items-center">
              <ProductGallery images={product.images || []} title={product.title} />
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <DialogTitle className="text-2xl font-bold">{product.title}</DialogTitle>
                <button onClick={handleToggleWishlist} className="bg-white rounded-full p-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {isInWishlist ? <Heart className="text-red-500 h-6 w-6" /> : <HeartOff className="text-gray-400 h-6 w-6" />}
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description ?? 'No description available.'}</p>
              </div>

              {/* Size Selector in Modal */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.label}
                        className={`px-3 py-1 border rounded-full text-sm font-medium ${
                          selectedSize?.label === size.label ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size.label} - ৳{size.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2">
                {product.discount && product.discount > 0 ? (
                  <>
                    <span className="text-red-600 font-bold text-2xl">৳{discountedPrice}</span>
                    <span className="line-through text-gray-400 text-lg">৳{selectedSize?.price ?? product.price}</span>
                  </>
                ) : (
                  <span className="font-bold text-2xl">৳{selectedSize?.price ?? product.price}</span>
                )}
              </div>

              {/* Add to Cart Button */}
              <Button variant="secondary" className="w-full h-12 text-lg" onClick={() => { handleAddToCart(); setIsDetailsOpen(false); }} disabled={isAddingToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
