'use client';

import { FormInput } from '@/components/form/FromInput';
import {
  useGetTrackOrderByInvoiceIdMutation,
  useUpdateTrackOrderByInvoiceIdMutation,
} from '@/redux/features/Order/ordersApi';
import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';

export type TOrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

type TOrderData = {
  invoiceId: string;
  orderStatus: TOrderStatus;
  totalPrice: number;
  shippingAddress?: {
    fullName: string;
  };
};

export default function DashboardOrderStatusUpdate() {
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [newStatus, setNewStatus] = useState<TOrderStatus>('pending');
  const [message, setMessage] = useState<string>('');

  const [trigger, { data: order, isFetching }] = useGetTrackOrderByInvoiceIdMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateTrackOrderByInvoiceIdMutation();

  const handleSearch = async () => {
    setMessage('');
    if (!invoiceNumber.trim()) {
      setMessage('Please enter an invoice number.');
      return;
    }

    try {
      await trigger(invoiceNumber).unwrap();
    } catch (err) {
      console.error(err);
      setMessage('Order not found or fetch error.');
    }
  };
  const handleUpdate = async () => {
    if (!invoiceNumber || !newStatus) return;

    try {

      await updateStatus({ invoiceId: invoiceNumber, status: newStatus }).unwrap();
      toast.success('Status updated successfully.');
    } catch (err) {
      setMessage('Failed to update status.');
    }
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value as TOrderStatus);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Track & Update Order</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Invoice Number</label>
        <FormInput
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder="Enter invoice number"
        />
        <button
          onClick={handleSearch}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
        >
          {isFetching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {order && (
        <div className="mt-6 border-t pt-4">
          <p>
            <strong>User:</strong> {order.shippingAddress?.fullName || 'N/A'}
          </p>
          <p>
            <strong>Status:</strong> {order.orderStatus}
          </p>
          <p>
            <strong>Total:</strong> ৳{order.totalPrice}
          </p>

          <div className="mt-4">
            <label className="block font-medium mb-1">Update Status</label>
            <select
              value={newStatus || order.orderStatus}
              onChange={handleStatusChange}
              className="w-full border rounded px-3 py-2 focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={handleUpdate}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      )}

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
