'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import Spinner from '@/components/Spinner';
import {
  useGetAllCustomBazarOrdersQuery,
  useUpdateCustomBazarOrderStatusMutation,
} from '@/redux/features/CustomBazar/customBazarApi';
import { toast } from 'sonner';

const ORDERS_PER_PAGE = 10;

const CustomBazarOrdersPage: React.FC = () => {
  const [invoiceIdSearch, setInvoiceIdSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  // Send only invoiceId as query param, trim and send undefined if empty to avoid filtering
  const { data, isLoading } = useGetAllCustomBazarOrdersQuery({
    invoiceId: invoiceIdSearch.trim() || undefined,
    page,
    limit: ORDERS_PER_PAGE,
  });

  const orders = data?.data?.data || [];
  const meta = data?.meta || {};

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateCustomBazarOrderStatusMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceIdSearch(e.target.value);
    setPage(1);
  };

  // Controlled select per order invoiceId
  const handleStatusSelect = (invoiceId: string, newStatus: string) => {
    setStatusMap((prev) => ({ ...prev, [invoiceId]: newStatus }));
  };

  // Update using invoiceId and selected status from map
  const handleUpdateClick = async (invoiceId: string) => {
    const newStatus = statusMap[invoiceId] || null;
    if (!newStatus) return;

    try {
      await updateStatus({ invoiceId, status: newStatus }).unwrap();

      toast.success('Successfully updated status..');
      setStatusMap((prev) => ({ ...prev, [invoiceId]: '' }));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold text-center">Custom Bazar Orders</h1>

      <div className="flex justify-center mb-4">
        <Input
          value={invoiceIdSearch}
          onChange={onSearchChange}
          placeholder="Search by Invoice ID only"
          className="max-w-md w-full"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found with this Invoice ID.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Total (Tk)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.invoiceId}</TableCell>
                  <TableCell>{order.user?.name || 'N/A'}</TableCell>
                  <TableCell>{order.user?.email || 'N/A'}</TableCell>
                  <TableCell>{order.user?.phone || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {order.address?.fullAddress || 'N/A'}
                  </TableCell>
                  <TableCell>৳{order.totalAmount?.toFixed(2) || '0'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
                            <p>
                              <strong>Invoice:</strong> {order.invoiceId}
                            </p>
                            <p>
                              <strong>Name:</strong> {order.user?.name}
                            </p>
                            <p>
                              <strong>Email:</strong> {order.user?.email}
                            </p>
                            <p>
                              <strong>Phone:</strong> {order.user?.phone}
                            </p>
                            <p>
                              <strong>Address:</strong> {order.address?.fullAddress}
                            </p>
                            <p>
                              <strong>Status:</strong> {order.status}
                            </p>
                            <p>
                              <strong>Total:</strong> ৳{order.totalAmount?.toFixed(2)}
                            </p>
                            <hr />
                            <h4 className="font-medium mt-2">Items:</h4>
                            {order.orderItems.map((item, idx) => (
                              <div key={idx} className="border-b py-1">
                                <p>
                                  <strong>{item.subcategoryName}</strong> ({item.unit}) x{' '}
                                  {item.quantity}
                                </p>
                                <p>
                                  Price/unit: ৳{item.pricePerUnit} | Total: ৳{item.totalPrice}
                                </p>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Select
                        value={statusMap[order.invoiceId] ?? order.status}
                        onValueChange={(val) => handleStatusSelect(order.invoiceId, val)}
                      >
                        <SelectTrigger className="w-24 h-8 text-sm">
                          <SelectValue placeholder={order.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            'pending',
                            'confirmed',
                            'shipped',
                            'delivered',
                            'cancelled',
                          ].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => handleUpdateClick(order?.invoiceId)}
                      >
                        Update
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta.total > ORDERS_PER_PAGE && orders.length > 0 && (
        <Pagination className="justify-center mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Prev
              </PaginationLink>
            </PaginationItem>
            {Array.from({ length: meta.totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationLink
                disabled={page === meta.totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CustomBazarOrdersPage;
