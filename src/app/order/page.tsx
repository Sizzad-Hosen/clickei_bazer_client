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
    <div className="flex min-h-screen min-w-0 max-w-full bg-gray-100">
      <aside className="w-0 shrink-0 md:w-72">
        <Sidebar />
      </aside>

      <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 p-3 sm:p-6 md:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold md:text-left md:text-3xl">Your Orders</h1>

        {/* Normal Orders */}
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">You have no normal orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <div
                key={order._id}
                className="relative rounded-lg border border-gray-200 bg-white p-4 shadow sm:p-6"
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

                <div className="mb-4 mt-3 flex min-w-0 flex-col items-start gap-1 pr-8 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="min-w-0 break-all text-lg font-semibold sm:text-xl">Order #{order.invoiceId || order._id}</h2>
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
                      <li key={item.productId} className="flex min-w-0 items-center gap-3 py-3">
                        <Image
                          width={40}
                          height={40}
                          src={item.image || '/placeholder.png'}
                          alt={item.title}
                          className="h-14 w-14 shrink-0 rounded-md border border-gray-300 object-cover sm:h-16 sm:w-16"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} 
                          </p>
                          <p className="text-sm text-gray-600">
                            size: {item.selectedSize?.label || 'N/A' } 
                          
                          </p>
                        </div>
                        <div className="shrink-0 text-sm font-semibold text-gray-900 sm:text-base">
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
            <h2 className="text-2xl font-semibold text-center md:text-left text-indigo-700">
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
                  className="relative mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow sm:p-6"
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
                  <div className="mb-4 flex min-w-0 flex-col items-start gap-1 pr-8 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="min-w-0 break-all text-lg font-semibold sm:text-xl">Order #{customOrder.invoiceId}</h2>
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
                    <p>
                      <span className="font-medium">Note:</span> {customOrder.siteNote}
                    </p>
                  )}

                  {/* Items */}
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Items:</h3>
                    <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                      {customOrder.orderItems.map((item, index) => (
                        <li key={index} className="py-2">
                          <div className="flex min-w-0 items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="break-words font-medium text-gray-900">{item.subcategoryName}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity}  × Tk {(item.pricePerUnit ?? 0).toFixed(2)}
                              </p>
                            </div>
                            <div className="shrink-0 text-right font-semibold text-gray-900">
                              Tk {(item.totalPrice ?? 0).toFixed(2)}
                            </div>
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
