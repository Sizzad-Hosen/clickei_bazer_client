'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  useGetAllCartsQuery,
  useRemoveCartMutation,
  useUpdateCartsQuantityMutation,
} from '@/redux/features/AddToCart/addToCartApi';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// CartItem type
interface CartItem {
  productId: string;
  title: string;
  price: number;
  discount?: number;
  quantity: number;
  image?: string;
  selectedSize?: {
    label: string;
    price: number;
  };
}

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data, isLoading, refetch } = useGetAllCartsQuery({});
  const [updateQty] = useUpdateCartsQuantityMutation();
  const [removeItem] = useRemoveCartMutation();

  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  // Load cart from backend
  useEffect(() => {
    if (data?.data?.items) {
      setLocalCart(data.data.items);
      calculateTotals(data.data.items);
    }
  }, [data]);

  // Function to calculate totals
  const calculateTotals = (items: CartItem[]) => {
    let subtotalCalc = 0;
    let discountCalc = 0;
    let quantityCalc = 0;

    items.forEach(item => {
      const itemPrice = item.selectedSize?.price ?? item.price;
      const itemDiscount = item.discount ? (itemPrice * item.discount) / 100 : 0;
      subtotalCalc += itemPrice * item.quantity;
      discountCalc += itemDiscount * item.quantity;
      quantityCalc += item.quantity;
    });

    setSubtotal(subtotalCalc);
    setTotalDiscount(discountCalc);
    setGrandTotal(subtotalCalc - discountCalc);
    setTotalQuantity(quantityCalc);
  };

  // Remove item
  const handleRemoveItemFromCart = async (productId: string) => {
    try {
      await removeItem(productId).unwrap();
      await refetch();
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item from cart');
    }
  };

  // ✅ Correct update quantity
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateQty({ data: { id: productId, quantity: newQuantity } }).unwrap();

      // update local state immediately
      const updatedCart = localCart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );

      setLocalCart(updatedCart);
      calculateTotals(updatedCart);

      // Optional: re-fetch backend for sync
      await refetch();

      toast.success('Quantity updated');
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="max-w-md w-full ml-auto h-full rounded-l-2xl border-l shadow-lg bg-white">
        <DrawerHeader>
          <DrawerTitle>Shopping Cart</DrawerTitle>
          <DrawerDescription>{totalQuantity} item(s) in your cart</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4 overflow-auto max-h-[60vh]">
          {isLoading ? (
            <p className="text-gray-500">Loading cart...</p>
          ) : localCart.length === 0 ? (
            <p className="text-gray-500 italic">Your cart is empty.</p>
          ) : (
            localCart.map(item => {
              const imageSrc =
                item.image && (item.image.startsWith('http') || item.image.startsWith('/'))
                  ? item.image
                  : '/placeholder.png';

              const itemPrice = item.selectedSize?.price ?? item.price;
              const itemDiscount = item.discount ? (itemPrice * item.discount) / 100 : 0;
              const totalItemPrice = (itemPrice - itemDiscount) * item.quantity;

              return (
                <div
                  key={item.productId}
                  className="flex gap-3 items-start border-b pb-3"
                >
                  <Image
                    src={imageSrc}
                    alt={item.title || 'Product'}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>

                    {item.selectedSize && (
                      <p className="text-sm text-gray-600">
                        Size: {item.selectedSize.label} - ৳{item.selectedSize.price.toFixed(2)}
                      </p>
                    )}

                    <p className="text-sm text-gray-600">
                      Price: ৳{itemPrice.toFixed(2)}{' '}
                      {item.discount ? `(Discount: ${item.discount}%)` : ''}
                    </p>
                    <p className="text-sm font-semibold">
                      Total: ৳{totalItemPrice.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveItemFromCart(item.productId)}
                  >
                    ×
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-4 border-t space-y-2">
          <p className="flex justify-between">
            <span>Subtotal:</span> <span>৳ {subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-red-600">
            <span>Total Discount:</span> <span>- ৳ {totalDiscount.toFixed(2)}</span>
          </p>
          <p className="flex justify-between font-bold text-lg">
            <span>Grand Total:</span> <span>৳ {grandTotal.toFixed(2)}</span>
          </p>

          <Link href="/checkout">
            <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
              Place Order
            </Button>
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
