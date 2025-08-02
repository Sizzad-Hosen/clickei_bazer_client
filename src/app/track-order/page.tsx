'use client';

import { useGetTrackOrderByInvoiceIdMutation } from '@/redux/features/TrackOrder/trackOrderApi';
import { useState } from 'react';

export default function TrackOrderPage() {
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const [trigger, { data: response, isFetching, error }] = useGetTrackOrderByInvoiceIdMutation();

  // Extract actual order data from response.data safely
  const order = response?.data;

  const handleSearch = () => {
    if (invoiceNumber.trim() === '') return;
    trigger(invoiceNumber.trim());
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Track Your Order</h1>

      <div className="mb-4">
        <label htmlFor="invoice" className="block font-semibold mb-1">
          Invoice Number
        </label>
        <input
          id="invoice"
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder="Enter your invoice number"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={isFetching}
        >
          {isFetching ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div>
        {error && (
          <p className="text-red-600 text-center mt-4">
            Order not found or error occurred. Please check the invoice number.
          </p>
        )}

        {order && (
          <div className="mt-6 border-t pt-4">
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
