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

  useDeleteCustomOrderByIdMutation,
  useGetAllCustomBazarOrdersQuery,
  useUpdateCustomBazarOrderStatusMutation,
  useUpdateCustomOrderPaymentStatusMutation,
} from '@/redux/features/CustomBazar/customBazarApi';
import { toast } from 'sonner';
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import { Order } from '@/types/order';
import { TMeta } from '@/types/global';



const ORDERS_PER_PAGE = 10;

const CustomBazarOrdersPage: React.FC = () => {
  const [invoiceIdSearch, setInvoiceIdSearch] = useState('');
  const [page, setPage] = useState(1);

  // Fetch orders
  const { data, isLoading, refetch } = useGetAllCustomBazarOrdersQuery({
    invoiceId: invoiceIdSearch.trim() || undefined,
    page,
    limit: ORDERS_PER_PAGE,
  });



  const orders: Order[] = data?.data?.data || [];

  const meta: TMeta = data?.meta || {
  total: 0,
  totalPages: 0,
  limit: 0,
  page: 0,
};

  // Mutation for updating order/payment status
  const [updateStatus] = useUpdateCustomBazarOrderStatusMutation();
  const [updatePaymentStatus] = useUpdateCustomOrderPaymentStatusMutation();
  const [deleteOrder] = useDeleteCustomOrderByIdMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceIdSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = async (invoiceId: string, newStatus: string, type: 'order' | 'payment') => {
    try {
      await updateStatus({ invoiceId, status: newStatus }).unwrap();
      toast.success(`${type === 'order' ? 'Order' : 'Payment'} status updated to "${newStatus}".`);
      refetch();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(`Failed to update ${type === 'order' ? 'order' : 'payment'} status.`);
    }
  };

  const handlePaymentStatusChange = async (invoiceId: string, newStatus: string, type: 'order' | 'payment') => {
    try {
      await updatePaymentStatus({ invoiceId, status: newStatus }).unwrap();
      toast.success(`${type === 'order' ? 'Order' : 'Payment'} status updated to "${newStatus}".`);
      refetch();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(`Failed to update ${type === 'order' ? 'order' : 'payment'} status.`);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteOrder(id).unwrap();
        Swal.fire('Deleted!', 'Custom Order deleted successfully.', 'success');
        toast.success('Custom Order deleted successfully.');
        refetch();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete custom order.', 'error');
        toast.error('Failed to delete custom order.');
      }
    }
  };

  const handlePrintOrder = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const orderItemsHtml = order.orderItems
      .map(
        (item) => `
      <tr>
        <td>${item.subcategoryName}</td>
        <td>${item.unit}</td>
        <td>${item.quantity}</td>
        <td>৳${item.pricePerUnit}</td>
        <td>৳${item.totalPrice}</td>
      </tr>
    `
      )
      .join('');

    printWindow.document.write(`
      <html>
      <head>
        <title>Print Order - ${order.invoiceId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px;}
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left;}
          th { background-color: #f4f4f4;}
        </style>
      </head>
      <body>
        <h1>Order Invoice: ${order.invoiceId}</h1>
        <p><strong>Name:</strong> ${order.user?.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${order.user?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${order.user?.phone || 'N/A'}</p>
        <p><strong>Address:</strong> ${order.address?.fullAddress || 'N/A'}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Total Amount:</strong> ৳${order.totalAmount?.toFixed(2) || '0'}</p>

        <h2>Order Items</h2>
        <table>
          <thead>
            <tr>
              <th>Subcategory</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Price/Unit</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
                  <TableCell className="max-w-xs truncate">{order.address?.fullAddress || 'N/A'}</TableCell>
                  <TableCell>৳{order.totalAmount?.toFixed(2) || '0'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
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
                                  <strong>{item.subcategoryName}</strong> ({item.unit}) x {item.quantity}
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
                        value={order.status}
                        onValueChange={(val) => handleStatusChange(order.invoiceId, val, 'order')}
                      >
                        <SelectTrigger className="w-24 h-8 text-sm">
                          <SelectValue placeholder={order.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={order.paymentStatus ?? 'pending'}
                        onValueChange={(val) => handlePaymentStatusChange(order.invoiceId, val, 'payment')}
                      >
                        <SelectTrigger className="w-24 h-8 text-sm">
                          <SelectValue placeholder={order.paymentStatus ?? 'pending'} />
                        </SelectTrigger>
                        <SelectContent>
                          {['pending', 'paid', 'success', 'failed'].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300"
                        size="sm"
                        onClick={() => handlePrintOrder(order)}
                      >
                        Print Order
                      </Button>

                      <Button variant="destructive" onClick={() => handleDeleteOrder(order._id)}>
                        <MdDelete />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta.total && meta.total > ORDERS_PER_PAGE && orders.length > 0 && (
        <Pagination className="justify-center mt-6">
          <PaginationContent>
            <PaginationItem>
             <PaginationLink
                 onClick={() => {
                   if (page !== 1) handlePageChange(page - 1);
                 }}
                 style={{ pointerEvents: page === 1 ? "none" : "auto", opacity: page === 1 ? 0.5 : 1 }}
               >
                 Prev
               </PaginationLink>
 
            </PaginationItem>
            {Array.from({ length: meta.totalPages || 0 }, (_, i) => (
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
                              onClick={() => {
                                if (page !== 1) handlePageChange(page + 1);
                              }}
                              style={{ pointerEvents: page === 1 ? "none" : "auto", opacity: page === 1 ? 0.5 : 1 }}
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