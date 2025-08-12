'use client';

import Swal from 'sweetalert2';
import Sidebar from '@/components/shared/Sidebar';
import Spinner from '@/components/Spinner';
import { useDeleteOrderByIdMutation, useGetAllOrdersByUserIdQuery } from '@/redux/features/Order/ordersApi';
import { useDeleteCustomOrderByIdMutation, useGetAllCustomOrdersByUserIdQuery } from '@/redux/features/CustomBazar/customBazarApi';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Image from 'next/image';
import { Order, OrderItem } from '@/types/order'; // Assuming you have these types in your types folder
import { TCustomBazerOrder } from '@/types/CustomBazar';


export default function UserOrdersPage() {
  // Normal Orders Query
  const { data: response, isLoading, isError, error, refetch } = useGetAllOrdersByUserIdQuery({});
  const orders: Order[] = response?.data || [];

  // Custom Bazar Orders Query
  const { data: customOrdersResponse } = useGetAllCustomOrdersByUserIdQuery();

 const customBazarOrders: TCustomBazerOrder[] = customOrdersResponse?.data || [];

  // Mutations for deleting orders
  const [deleteOrder] = useDeleteOrderByIdMutation();
  const [deleteCustomOrder] = useDeleteCustomOrderByIdMutation();

  // Delete normal order
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

  // Delete custom bazar order
  const handleCustomOrderDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this order?',
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
        refetch(); // Re-fetch updated list
      } catch (err) {
        toast.error('Failed to delete order');
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

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Your Orders</h1>

        {/* Normal Orders */}
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <div
                key={order._id}
                className="bg-white shadow rounded-lg p-6 border border-gray-200 relative"
              >
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
                  <h2 className="text-xl font-semibold">
                    Order #{order.invoiceId || order._id}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {order.createdAt ? format(new Date(order.createdAt), 'PPP p') : 'N/A'}
                  </span>
                </div>

                <p><span className="font-medium">Status:</span> {order.orderStatus || 'Pending'}</p>
                <p>
                  <span className="font-medium">Total:</span>{' '}
                  <span className="text-green-600 font-semibold">
                    Tk {order.totalPrice?.toFixed(2) || '0.00'}
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
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="ml-4 font-semibold text-gray-900">
                          Tk{item.price.toFixed(2)}
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

            {customBazarOrders.map((customOrder) => (
              <div
                key={customOrder._id}
                className="bg-white shadow rounded-lg p-6 border border-gray-200 relative"
              >
                <button
                  onClick={() => handleCustomOrderDelete(customOrder._id)}
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

                <div className="flex justify-between pt-4 items-center mb-4">
                  <h2 className="text-xl font-semibold">Order #{customOrder.invoiceId}</h2>
                  <span className="text-sm text-gray-500">
                    {customOrder.createdAt ? format(new Date(customOrder.createdAt), 'PPP p') : 'N/A'}
                  </span>
                </div>

                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className="capitalize">{customOrder.status}</span>
                </p>
                <p>
                  <span className="font-medium">Total:</span>{' '}
                  <span className="text-green-600 font-semibold">Tk {customOrder.totalAmount.toFixed(2)}</span>
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

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Items:</h3>
                  <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {customOrder.orderItems.map((item, index) => (
                      <li key={index} className="py-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{item.subcategoryName}</p>
                            <p className="text-sm text-gray-600">
                              {item.quantity} {item.unit} × Tk {item.pricePerUnit.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right font-semibold text-gray-900">
                            Tk {item.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
