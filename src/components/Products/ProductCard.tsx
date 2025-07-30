'use client';

import { Product } from '@/types/products';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAddCartMutation } from '@/redux/features/AddToCart/addToCartApi';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';


interface Props {
  product: Product;
  onOpenCart: () => void;
  isFavorite?: boolean;
}

export default function ProductCard({ product, onOpenCart, isFavorite: initialFavorite = false }: Props) {

  console.log("product", product)
  const [addCart, { isLoading: isAddingToCart }] = useAddCartMutation();

  // const [toggleFavorite, { isLoading: isTogglingFavorite }] = useToggleFavoriteMutation();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

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

  const handleToggleFavorite = async () => {
    // try {
    //   await toggleFavorite(product._id).unwrap();
    //   setIsFavorite(!isFavorite);
    //   toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    // } catch (error) {
    //   toast.error('Failed to update favorites');
    //   console.error(error);
    // }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPosition({ x, y });
  };

  return (
    <>
      <div className="rounded-xl border bg-white shadow hover:shadow-md transition w-full sm:w-64 h-96 flex flex-col relative">
        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          // disabled={isTogglingFavorite}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-100 transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>

        {/* Image with parallax effect */}
        <motion.div
          className="relative h-56 w-full bg-gray-100 overflow-hidden"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover rounded-t-xl"
            style={{
              objectPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
              transition: 'object-position 0.3s ease-out',
            }}
            sizes="(max-width: 640px) 100vw, 256px"
          />
        </motion.div>

        <div className="p-4 space-y-3 flex flex-col flex-grow">
          <div className="flex-grow">
            <h2 className="text-base font-semibold line-clamp-1">{product.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
            <p className="text-lg font-medium text-gray-800 mt-2">৳{product.price}</p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDetailsOpen(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Details
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isAddingToCart ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{product.title}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
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
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Price</h3>
                <p className="text-2xl font-bold text-primary">৳{product.price}</p>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  // disabled={isTogglingFavorite}
                  className="flex-1"
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                  {isFavorite ? 'Favorited' : 'Favorite'}
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleAddToCart();
                    setIsDetailsOpen(false);
                  }}
                  disabled={isAddingToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>

          {product?.images?.length > 1 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">More Images</h3>
              <div className="grid grid-cols-3 gap-2">
                {product?.images?.slice(1).map((image, index) => (
                  <div key={index} className="relative h-24 w-full bg-gray-100 rounded-md overflow-hidden">
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