'use client';

import { useGetTrackOrderByInvoiceIdMutation } from '@/redux/features/Order/ordersApi';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/shared/Sidebar';
import { useGetAllCustomBazarOrdersQuery } from '@/redux/features/CustomBazar/customBazarApi';
import { Button } from '@/components/ui/button';

export default function TrackOrderPage() {
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
const [invoiceIdSearch, setInvoiceIdSearch] = useState('');
  // Use mutation hook
  const [trigger, { data: response, isLoading, error }] = useGetTrackOrderByInvoiceIdMutation();


 useGetAllCustomBazarOrdersQuery({
    invoiceId: invoiceIdSearch.trim() || undefined,

  });


  const order = response?.data;

  const handleSearch = () => {
    if (invoiceNumber.trim() === '') return;
    trigger(invoiceNumber.trim());
    setInvoiceIdSearch(invoiceNumber.trim());
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex justify-center items-start p-4 sm:p-6">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Track Your Order</h1>

            <div className="mb-6">
              <label htmlFor="invoice" className="block font-semibold mb-2 text-gray-700">
                Invoice Number
              </label>
              <input
                id="invoice"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Enter your invoice number"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <Button
              variant={"secondary"}
                onClick={handleSearch}
                className="mt-4 w-full "
                disabled={isLoading}
                aria-disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-center mt-4">
                Order not found or error occurred. Please check the invoice number.
              </p>
            )}

            {/* Order Info */}
            {order && (
              <div className="mt-6 border-t pt-4 space-y-2 text-gray-800">
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="capitalize">{order.orderStatus}</span>
                </p>
                <p>
                  <strong>Created At:</strong>{' '}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Last Updated:</strong>{' '}
                  {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
