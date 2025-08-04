'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import CartDrawer from '../Carts/CartDrawer';
import { Product } from '@/types/products';

export default function ProductList({ products }: { products: Product[] }) {
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} onOpenCart={openCart} />
        ))}
      </div>

      <CartDrawer open={cartOpen} onClose={closeCart} />
    </>
  );
}
