'use client';

import React from 'react';
import Swal from 'sweetalert2';
import Sidebar from '@/components/shared/Sidebar';
import Spinner from '@/components/Spinner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Image from 'next/image';

import {
  useDeleteOrderByIdMutation,
  useGetAllOrdersByUserIdQuery,
} from '@/redux/features/Order/ordersApi';
import {
  useDeleteCustomOrderByIdMutation,
  useGetAllCustomOrdersByUserIdQuery,
} from '@/redux/features/CustomBazar/customBazarApi';

import { Order, OrderItem } from '@/types/order';
import { TCustomBazerOrder } from '@/types/CustomBazar';

function UserOrdersPage() {
  // Normal Orders
  const { data: response, isLoading, isError, error, refetch } = useGetAllOrdersByUserIdQuery({});
  const orders: Order[] = response?.data || [];
  console.log('Orders:', orders);

  // Custom Bazar Orders
  const { data: customOrdersResponse } = useGetAllCustomOrdersByUserIdQuery();
  const customBazarOrders: TCustomBazerOrder[] = customOrdersResponse?.data || [];
console.log('Custom Bazar Orders:', customBazarOrders)
  // Delete Mutations
  const [deleteOrder] = useDeleteOrderByIdMutation();
  const [deleteCustomOrder] = useDeleteCustomOrderByIdMutation();

  // Delete Normal Order
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this order? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteOrder(id).unwrap();
        toast.success('Order deleted successfully');
        refetch();
      } catch (err) {
        toast.error('Failed to delete order');
        console.error(err);
      }
    }
  };

  // Delete Custom Bazar Order
  const handleCustomOrderDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this custom order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteCustomOrder(id).unwrap();
        toast.success('Custom Bazar Order deleted successfully');
        refetch();
      } catch (err) {
        toast.error('Failed to delete custom order');
        console.error(err);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Spinner />
        </main>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <h2 className="text-red-600 font-semibold text-lg">Failed to load orders</h2>
          <p>{(error as { data?: { message?: string } })?.data?.message || 'Unknown error occurred'}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside>
        <Sidebar />
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Your Orders</h1>

        {/* Normal Orders */}
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">You have no normal orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <div
                key={order._id}
                className="bg-white shadow rounded-lg p-6 border border-gray-200 relative"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(order._id)}
                  className="absolute top-4 right-4 border border-red-400 text-red-600 hover:text-red-800 transition rounded p-1"
                  title="Delete Order"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex justify-between items-center mb-4 mt-3">
                  <h2 className="text-xl font-semibold">Order #{order.invoiceId || order._id}</h2>
                  <span className="text-sm text-gray-500">
                    {order.createdAt ? format(new Date(order.createdAt), 'PPP p') : 'N/A'}
                  </span>
                </div>

                <p>
                  <span className="font-medium">Status:</span> {order.orderStatus || 'Pending'}
                </p>
                <p>
                  <span className="font-medium">Payment:</span> {order?.paymentMethod || 'Pending'}
                </p>

                <p>
                  <span className="font-medium">GrandTotal:</span>{' '}
              <span className="text-green-600 font-semibold">
  Tk {(order?.grandTotal ?? 0).toFixed(2)}
</span>

                </p>

                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Items:</h3>
                  <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {order?.items.map((item: OrderItem) => (
                      <li key={item.productId} className="flex items-center py-3">
                        <Image
                          width={40}
                          height={40}
                          src={item.image || '/placeholder.png'}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-md border border-gray-300 mr-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} 
                          </p>
                          <p className="text-sm text-gray-600">
                            size: {item.selectedSize?.label || 'N/A' } 
                          
                          </p>
                        </div>
                        <div className="ml-4 font-semibold text-gray-900">
                          Tk {item.price.toFixed(2)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Bazar Orders */}
        {customBazarOrders.length > 0 && (
          <div className="space-y-6 mt-10">
            <h2 className="text-3xl text-center font-semibold  md:text-left text-gray-800 mb-">
              Custom Bazar Orders
            </h2>

            {customBazarOrders.map((customOrder) => {
              const totalAmount = customOrder.orderItems.reduce(
                (sum, item) => sum + (item.totalPrice || 0),
                0
              );

              return (
                <div
                  key={customOrder._id}
                  className="bg-white shadow rounded-lg p-6 border border-gray-200 relative mb-6"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleCustomOrderDelete(customOrder._id as string)}
                    className="absolute top-4 right-4 border border-red-400 text-red-600 hover:text-red-800 transition rounded p-1"
                    title="Delete Order"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Header */}
                  <div className="flex justify-between pt-4 items-center mb-4">
                    <h2 className="text-xl font-semibold">Order #{customOrder.invoiceId}</h2>
                    <span className="text-sm text-gray-500">
                      {customOrder.createdAt
                        ? format(new Date(customOrder.createdAt), 'PPP p')
                        : 'N/A'}
                    </span>
                  </div>

                  {/* Summary */}
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className="capitalize">{customOrder.status}</span>
                  </p>
                  <p>
                    <span className="font-medium">Total:</span>{' '}
                    <span className="text-green-600 font-semibold">
                      Tk {totalAmount.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Payment:</span>{' '}
                    <span className="capitalize">{customOrder.paymentMethod}</span>
                  </p>
{customOrder.siteNote && (
  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
    <p className="text-sm text-gray-700">
      <span className="font-medium text-gray-900">Note:</span>{' '}
      {customOrder.siteNote}
    </p>
  </div>
)}

{/* Items */}
<div className="mt-6">
  <h3 className="text-lg font-semibold mb-3 text-gray-800">Order Items</h3>
  <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
    {customOrder.orderItems.map((item, index) => (
      <li
        key={index}
        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
      >
        {/* Left section */}
        <div>
          <p className="font-medium text-gray-900">{item.subcategoryName}</p>
          <p className="text-sm text-gray-600">
            Qty: {item?.quantity} × Size:{' '}
            {parseFloat(item?.size ?? '') || 0} {item?.unit}
          </p>
        </div>

        {/* Right section */}
        <div className="text-right">
          <p className="text-sm text-gray-500">Subtotal</p>
          <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
            Tk {(item.totalPrice ?? 0).toFixed(2)}
          </span>
        </div>
      </li>
    ))}
  </ul>
</div>


                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProtectedUserOrdersPage() {
  return (
    <ProtectedRoute>
      <UserOrdersPage />
    </ProtectedRoute>
  );
}
