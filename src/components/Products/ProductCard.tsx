'use client';

import { Product } from '@/types/products';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAddCartMutation } from '@/redux/features/AddToCart/addToCartApi';

interface Props {
  product: Product;
  onOpenCart: () => void;
}

export default function ProductCard({ product, onOpenCart }: Props) {
  const [addCart, { isLoading }] = useAddCartMutation();

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
      onOpenCart(); // ✅ Open drawer
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow hover:shadow-md transition">
      <motion.div
        className="relative h-48 w-full bg-gray-100"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <Image
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.title}
          fill
          className="object-cover rounded-t-xl"
        />
      </motion.div>

      <div className="p-4 space-y-2">
        <h2 className="text-base font-semibold">{product.title}</h2>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <p className="text-sm text-gray-600">৳{product.price}</p>

        <Button className="w-full" onClick={handleAddToCart} disabled={isLoading}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
