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
  useGetAllCustomBazarProductsQuery,
  useUpdateCustomBazarOrderStatusMutation,
  useUpdateCustomOrderItemsMutation,
  useUpdateCustomOrderPaymentStatusMutation,
} from '@/redux/features/CustomBazar/customBazarApi';
import { toast } from 'sonner';
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import { TMeta } from '@/types/global';
import { CUSTOM_ORDER_STATUSES, TCustomBazerOrder, TCustomOrderStatus, TPaymentStatus } from '@/types/CustomBazar';
import { Pencil, Plus } from 'lucide-react';
import CustomBazarForm from '@/features/custom-bazar/CreateCustomBazar';

const ORDERS_PER_PAGE = 10;

const AllCustomBazarOrders: React.FC = () => {
  const [invoiceIdSearch, setInvoiceIdSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetAllCustomBazarOrdersQuery({
    invoiceId: invoiceIdSearch.trim() || undefined,
    page,
    limit: ORDERS_PER_PAGE,
  });

  const orders: TCustomBazerOrder[] = data?.data || [];
  const meta: TMeta = data?.meta || { total: 0, totalPages: 0, limit: 0, page: 0 };
  const [updateStatus] = useUpdateCustomBazarOrderStatusMutation();
  const [updatePaymentStatus] = useUpdateCustomOrderPaymentStatusMutation();
  const [deleteOrder] = useDeleteCustomOrderByIdMutation();
  const { data: customProductData } = useGetAllCustomBazarProductsQuery();
  const customProducts = customProductData?.data ?? [];
  const [updateCustomOrderItems, { isLoading: isUpdatingItems }] = useUpdateCustomOrderItemsMutation();
  const [draftItems, setDraftItems] = useState<Array<{ product: string; subcategoryName: string; quantity: number }>>([]);

  const saveCustomOrderItems = async (invoiceId: string) => {
    try {
      await updateCustomOrderItems({ invoiceId, orderItems: draftItems }).unwrap();
      toast.success('Custom Bazar items updated');
      refetch();
    } catch {
      toast.error('Failed to update Custom Bazar items');
    }
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoiceIdSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = async (
    invoiceId: string,
    newStatus: TCustomOrderStatus | TPaymentStatus,
    type: 'order' | 'payment'
  ) => {
    try {
      if (type === 'order') {
        await updateStatus({ invoiceId, status: newStatus as TCustomOrderStatus }).unwrap();
      } else {
        await updatePaymentStatus({ invoiceId, status: newStatus }).unwrap();
      }
      toast.success(
        `${type === 'order' ? 'Order' : 'Payment'} status updated to "${newStatus}".`
      );
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
      } catch {
        Swal.fire('Error!', 'Failed to delete custom order.', 'error');
        toast.error('Failed to delete custom order.');
      }
    }
  };

  const handlePrintOrder = (order: TCustomBazerOrder) => {
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
        <p><strong>Order Note:</strong> ${order.siteNote}</p>
        <p><strong>Total Amount:</strong> ৳ ${order.totalAmount?.toFixed(2) || '0'}</p>

        <h2>Order Items</h2>
        <table>
          <thead>
            <tr>
              <th>Subcategory</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Price/Unit</th>
              <th>SubTotal Price</th>
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
  const [isAddOpen, setIsAddOpen] = useState(false);
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <h1 className="text-2xl font-semibold text-center">Custom Bazar Orders</h1>
    <Button
          variant="secondary"
          onClick={() => setIsAddOpen(true)}
          className="flex w-full items-center gap-2 sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add CustomBazar Product
        </Button>
      </div>

      <div className="flex justify-center mb-4">
        <Input
          value={invoiceIdSearch}
          onChange={onSearchChange}
          placeholder="Search by Invoice ID"
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
                      {/* Details Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">Details</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 text-sm max-h-[70vh] overflow-y-auto pr-1">
                            <p><strong>Invoice:</strong> {order.invoiceId}</p>
                            <p><strong>Name:</strong> {order.user?.name}</p>
                            <p><strong>Email:</strong> {order.user?.email}</p>
                            <p><strong>Phone:</strong> {order.user?.phone}</p>
                            <p><strong>Address:</strong> {order.address?.fullAddress}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            {order.completedAt && (
                              <p><strong>Completed:</strong> {new Date(order.completedAt).toLocaleString()}</p>
                            )}
                            <p><strong>OrderNote:</strong> {order.siteNote}</p>
                            <p><strong>Total:</strong> ৳{order.totalAmount?.toFixed(2)}</p>
                            <hr />
                            <h4 className="font-semibold mt-2">Order items</h4>
                            {order.orderItems.map((item, idx) => (
                              <article key={`${item.subcategoryName}-${idx}`} className="rounded-lg border bg-gray-50 p-3">
                                <p>
                                  <strong>{item.subcategoryName}</strong> ({item.unit}) x {item.quantity}
                                </p>
                                <p>Size : {item.unit}</p>
                                <p>
                                  Price/unit: ৳{item.pricePerUnit} | Total: ৳{item.totalPrice}
                                </p>
                              </article>
                            ))}
                            <div className="rounded-lg bg-gray-900 p-3 text-right font-semibold text-white">
                              Grand total: Tk {(order.totalAmount ?? 0).toFixed(2)}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => setDraftItems(order.orderItems.map((item) => ({
                              product: typeof item.product === 'string' ? item.product : (item.product as { _id: string })._id,
                              subcategoryName: item.subcategoryName,
                              quantity: item.quantity,
                            })))}
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit custom order - {order.invoiceId}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-5">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Order status</label>
                              <Select
                                value={order.status}
                                onValueChange={(value) =>
                                  handleStatusChange(order.invoiceId as string, value as TCustomOrderStatus, 'order')
                                }
                              >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {CUSTOM_ORDER_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Payment status</label>
                              <Select
                                value={order.paymentStatus ?? 'pending'}
                                onValueChange={(value) =>
                                  handleStatusChange(order.invoiceId as string, value as TPaymentStatus, 'payment')
                                }
                              >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {['pending', 'paid', 'success', 'failed'].map((status) => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-3 border-t pt-4">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold">Products and quantities</label>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const product = customProducts[0];
                                    const subcategory = product?.subcategories?.[0];
                                    if (product && subcategory) setDraftItems((items) => [...items, { product: product._id, subcategoryName: subcategory.name, quantity: 1 }]);
                                  }}
                                >
                                  Add item
                                </Button>
                              </div>
                              {draftItems.map((item, index) => {
                                const selectedProduct = customProducts.find((product) => product._id === item.product);
                                return (
                                  <div key={index} className="space-y-2 rounded-md border p-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <select
                                        className="rounded-md border px-3 py-2 text-sm"
                                        value={item.product}
                                        onChange={(event) => {
                                          const product = customProducts.find((entry) => entry._id === event.target.value);
                                          setDraftItems((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, product: event.target.value, subcategoryName: product?.subcategories?.[0]?.name ?? '' } : entry));
                                        }}
                                      >
                                        {customProducts.map((product) => <option key={product._id} value={product._id}>{product.category}</option>)}
                                      </select>
                                      <select
                                        className="rounded-md border px-3 py-2 text-sm"
                                        value={item.subcategoryName}
                                        onChange={(event) => setDraftItems((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, subcategoryName: event.target.value } : entry))}
                                      >
                                        {(selectedProduct?.subcategories ?? []).map((subcategory, subcategoryIndex) => (
                                          <option
                                            key={`${selectedProduct?._id}-${subcategory.name}-${subcategory.unit}-${subcategory.pricePerUnit}-${subcategoryIndex}`}
                                            value={subcategory.name}
                                          >
                                            {subcategory.name} ({subcategory.unit})
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="grid grid-cols-[1fr_auto] gap-2">
                                      <Input
                                        type="number"
                                        min={0.01}
                                        step="any"
                                        value={item.quantity}
                                        onChange={(event) => setDraftItems((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, quantity: Math.max(0.01, Number(event.target.value)) } : entry))}
                                      />
                                      <Button type="button" variant="destructive" size="sm" onClick={() => setDraftItems((items) => items.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button>
                                    </div>
                                  </div>
                                );
                              })}
                              <Button
                                type="button"
                                className="w-full"
                                disabled={isUpdatingItems || draftItems.length === 0}
                                onClick={() => saveCustomOrderItems(order.invoiceId as string)}
                              >
                                {isUpdatingItems ? 'Saving...' : 'Save Custom Bazar items'}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Order Status */}
                      <Select
                        value={order.status}
                        onValueChange={(val) => handleStatusChange(order.invoiceId as string, val as TCustomOrderStatus, 'order')}
                      >
                        <SelectTrigger className="w-24 h-8 text-sm">
                          <SelectValue placeholder={order.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {CUSTOM_ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {order.status === 'completed' && (
                        <span className="text-xs font-medium text-green-700">Completed</span>
                      )}

                      {/* Payment Status */}
                      <Select
                        value={order.paymentStatus ?? 'pending'}
                        onValueChange={(val) => handleStatusChange(order.invoiceId as string, val as TPaymentStatus, 'payment')}
                      >
                        <SelectTrigger className="w-24 h-8 text-sm">
                          <SelectValue placeholder={order.paymentStatus ?? 'pending'} />
                        </SelectTrigger>
                        <SelectContent>
                          {['pending', 'paid', 'success', 'failed'].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        className="border-amber-600 text-amber-700 transition-colors duration-300 hover:bg-amber-500 hover:text-gray-950"
                        size="sm"
                        onClick={() => handlePrintOrder(order)}
                      >
                        Print
                      </Button>

                      <Button variant="destructive" size="sm" onClick={() => handleDeleteOrder(order._id as string)}>
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

      {/* Pagination */}
      {meta.total > ORDERS_PER_PAGE && orders.length > 0 && (
        <Pagination className="justify-center mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                onClick={() => page > 1 && handlePageChange(page - 1)}
                style={{ pointerEvents: page === 1 ? 'none' : 'auto', opacity: page === 1 ? 0.5 : 1 }}
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
                onClick={() => page < (meta.totalPages || 1) && handlePageChange(page + 1)}
                style={{ pointerEvents: page === (meta.totalPages || 1) ? 'none' : 'auto', opacity: page === (meta.totalPages || 1) ? 0.5 : 1 }}
              >
                Next
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      
        {/* Add Service Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <CustomBazarForm
            onSuccess={() => {
              setIsAddOpen(false); // close modal
              refetch();           // refresh service list
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllCustomBazarOrders;
