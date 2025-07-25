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

  const cartData = data?.data;
console.log('Cart Data:', cartData);
  const cartItems = Array.isArray(cartData?.items) ? cartData.items : [];
  const totalAmount = cartData?.totalAmount || 0;
  const totalQuantity = cartData?.totalQuantity || 0;

  const handleRemoveItemFromCart = async (id: string) => {
    try {
      await removeItem(id).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart');
      console.error(error);
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    try {

    await updateQty({ data: { id, quantity: newQuantity } }).unwrap();

      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error(error);
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
          ) : cartItems.length === 0 ? (
            <p className="text-gray-500 italic">Your cart is empty.</p>
          ) : (
            cartItems.map((item: any) => (
              <div
                key={item._id}
                className="flex gap-3 items-center border-b pb-3"
              >
                <Image
                  src={item?.images?.[0] || '/placeholder.png'}
                  alt={item?.title || 'Product'}
                  width={80}
                  height={80}
                  className="rounded"
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
                        handleUpdateQuantity(item.productId, Math.max(item.quantity - 1, 1))
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
            ))
          )}
        </div>

        <div className="p-4 border-t">
          <p className="text-lg font-bold">Total: ৳{totalAmount}</p>
          <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
            Place Order
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
