'use client';
import Swal from 'sweetalert2';
import { useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { useDeleteOrderByIdMutation, useGetAllOrdersByUserIdQuery } from '@/redux/features/Order/ordersApi';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function UserOrdersPage() {
  const { data: response, isLoading, isError, error, refetch } = useGetAllOrdersByUserIdQuery({});
  const orders = response?.data || [];

const [deleteOrder] = useDeleteOrderByIdMutation()

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      refetch(); // Refetch your orders
    } catch (err) {
      toast.error('Failed to delete order');
      console.error(err);
    }
  }
};
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

  if (isError) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <h2 className="text-red-600 font-semibold text-lg">Failed to load orders</h2>
          <p>{(error as any)?.data?.message || 'Unknown error occurred'}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar - responsive */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-20
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex-shrink-0
        `}
      >
        <Sidebar />
      </aside>

      {/* Overlay on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Your Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div
                key={order._id}
                className="bg-white shadow rounded-lg p-6 border border-gray-200 relative"
              >
                {/* Delete Order Button */}
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

                {/* Order Header */}
                <div className="flex justify-between items-center mb-4 mt-3">
                  <h2 className="text-xl font-semibold">
                    Order #{order.invoiceId || order._id}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {order.createdAt ? format(new Date(order.createdAt), 'PPP p') : 'N/A'}
                  </span>
                </div>

                {/* Order Info */}
                <p><span className="font-medium">Status:</span> {order.orderStatus || 'Pending'}</p>
                <p><span className="font-medium">Total:</span> <span className="text-green-600 font-semibold">Tk {order.totalPrice?.toFixed(2) || '0.00'}</span></p>

                {/* Order Items */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Items:</h3>
                  <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {order.cart?.items?.map((item: any) => (
                      <li key={item.productId} className="flex items-center py-3">
                        <img
                          src={item.image}
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
      </main>
    </div>
  );
}
