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

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data, isLoading } = useGetAllCartsQuery({});
  
  const [updateQty] = useUpdateCartsQuantityMutation();
  const [removeItem] = useRemoveCartMutation();

  // ✅ Local cart state
  const [localCart, setLocalCart] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  // ✅ Sync local cart with backend data
  useEffect(() => {
    if (data?.data?.items) {
      setLocalCart(data.data.items);
      calculateTotals(data.data.items);
    }
  }, [data]);

  // ✅ Recalculate totals when cart changes
  const calculateTotals = (items: any[]) => {
    const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const amount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotalQuantity(quantity);
    setTotalAmount(amount);
  };

  const handleRemoveItemFromCart = async (productId: string) => {
    try {
      await removeItem(productId).unwrap();

      const updatedCart = localCart.filter(item => item.productId !== productId);
      setLocalCart(updatedCart);
      calculateTotals(updatedCart);

      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart');
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      await updateQty({ data: { id: productId, quantity: newQuantity } }).unwrap();

      const updatedCart = localCart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setLocalCart(updatedCart);
      calculateTotals(updatedCart);

      toast.success('Quantity updated');
    } catch (error) {
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

        <div className="p-4 space-y-4 overflow-auto max-h-[70vh]">
          {isLoading ? (
            <p className="text-gray-500">Loading cart...</p>
          ) : localCart.length === 0 ? (
            <p className="text-gray-500 italic">Your cart is empty.</p>
          ) : (
            localCart.map((item: any, index: number) => {
              const imageSrc =
                typeof item?.image === 'string' &&
                (item.image.startsWith('http') || item.image.startsWith('/'))
                  ? item.image
                  : '/placeholder.png';

              return (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex gap-3 items-center border-b pb-3"
                >
                  <Image
                    src={imageSrc?imageSrc :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2U2akySBgSHUK-foX-9SGFmLk6zEuGYNNqw&savatar-placeholder.png"}
                    alt={item?.title || 'Product'}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm">
                      ৳{item.price} x {item.quantity}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))
                        }
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateQuantity(item.productId, item.quantity + 1)
                        }
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

        <div className="p-4 border-t">
        <p className="text-lg font-bold">Total: ৳ {totalAmount.toFixed(2)}</p>

            <Link href={"/checkout"}>
          <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">

            Place Order

          </Button>
            </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
