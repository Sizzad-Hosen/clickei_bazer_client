'use client';

import { useGetTrackOrderByInvoiceIdMutation } from '@/redux/features/Order/ordersApi';
import { useState } from 'react';

export default function TrackOrderPage() {
  const [invoiceNumber, setInvoiceNumber] = useState('');

  // Use mutation hook
  const [trigger, { data: response, isLoading, error }] = useGetTrackOrderByInvoiceIdMutation();

  // Extract actual order data safely
  const order = response?.data;

  const handleSearch = () => {
    if (invoiceNumber.trim() === '') return;
    trigger(invoiceNumber.trim());
  };

  return (
    <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mt-16 px-4 sm:px-6 md:px-8 py-6 bg-white rounded shadow-md">
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
        <button
          onClick={handleSearch}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div>
        {error && (
          <p className="text-red-600 text-center mt-4">
            Order not found or error occurred. Please check the invoice number.
          </p>
        )}

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
  );
}
