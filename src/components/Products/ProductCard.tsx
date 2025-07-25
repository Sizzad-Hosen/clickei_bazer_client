'use client';

import { Product } from '@/types/products';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const productImage = product.images?.[0] || '/placeholder.png';

  return (
    <div className="rounded-2xl border shadow-md bg-white overflow-hidden hover:shadow-lg transition-all">
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Trigger: Card */}
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <motion.div
              className="relative h-48 w-full bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
              />
            </motion.div>

            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>

              {/* ❌ FIX: removed nested <p> */}
              <div className="text-sm text-gray-600">
                <span className="font-medium">৳</span> {product.price}
              </div>
              <div className="text-sm text-gray-600">
                Quantity: {product.quantity}
              </div>

              <Button>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent className="max-w-md sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{product.title}</DialogTitle>
            <DialogDescription>{product.description}</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <motion.div
              className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            </motion.div>

            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {product.name}</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
              <p><strong>Price:</strong> ৳{product.price}</p>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // dispatch(addToCart(product));
                setOpen(false);
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
