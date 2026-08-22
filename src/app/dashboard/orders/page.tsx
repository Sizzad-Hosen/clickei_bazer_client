"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import {
  useDeleteOrderByIdMutation,
  useGetAllOrdersQuery,
  useUpdateOrderPaymentStatusMutation,
  useUpdateOrderItemsMutation,
  useUpdateStatusMutation,
} from "@/redux/features/Order/ordersApi";
import { useGetAllProductsQuery } from "@/redux/features/Products/productApi";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { getOrderTotal, ORDER_STATUSES, Order, OrderStatus } from "@/types/order";
import { TQueryParam } from "@/types/global";
import Image from "next/image";
import { Pencil } from "lucide-react";

const ORDERS_PER_PAGE = 10;


const OrdersPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchInvoiceId, setSearchInvoiceId] = useState<string>("");

  const {
    data,
    isLoading,
  } = useGetAllOrdersQuery({
    page,
    limit: ORDERS_PER_PAGE,
    invoiceId: searchInvoiceId.trim() || undefined,
  } as TQueryParam);

const orders = data?.data || [];
const meta = data?.meta || { total: 0, totalPages: 0 };


  const [updateStatus] = useUpdateStatusMutation();
  const [updatePaymentStatus] = useUpdateOrderPaymentStatusMutation();
  const [deleteOrder] = useDeleteOrderByIdMutation();
  const [updateOrderItems, { isLoading: isUpdatingItems }] = useUpdateOrderItemsMutation();
  const { data: productData } = useGetAllProductsQuery({ page: 1, limit: 1000 });
  const products = productData?.data ?? [];
  type DraftOrderItem = {
    productId: string;
    quantity: number;
    discount: number;
    selectedSize?: { label: string; price: number };
  };
  const [draftItems, setDraftItems] = useState<DraftOrderItem[]>([]);

  const saveOrderItems = async (invoiceId: string) => {
    try {
      await updateOrderItems({ invoiceId, items: draftItems }).unwrap();
      toast.success("Order products updated");
    } catch {
      toast.error("Failed to update order products");
    }
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleUpdateStatus = async (invoiceId: string, newStatus: OrderStatus) => {
    try {
      await updateStatus({ invoiceId, status: newStatus }).unwrap();
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleUpdatePaymentStatus = async (
    invoiceId: string,
    newStatus: string
  ) => {
    try {
      await updatePaymentStatus({ invoiceId, status: newStatus }).unwrap();
      toast.success("Payment status updated");
    } catch {
      toast.error("Failed to update payment status");
    }
  };

 const handlePrintOrder = (order: Order) => {
  const printWindow = window.open("", "PRINT", "width=800,height=800");
  if (!printWindow) return;

  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : "";

  // Build table rows with size, discount, subtotal
  const itemsHTML = order?.items
    ?.map((item, index) => {
      const discount = item.discount ?? 0;
      const baseUnitPrice = item.selectedSize?.price ?? (discount < 100 ? item.price / (1 - discount / 100) : item.price);
      const baseTotal = baseUnitPrice * item.quantity;
      const subtotal = item.price * item.quantity;
      const discountAmount = baseTotal - subtotal;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.title}<br/><small>Size: ${item.selectedSize?.label ?? 'N/A'}${item.selectedSize ? ` (৳${item.selectedSize.price.toFixed(2)})` : ''}</small></td>
          <td>${item.quantity}</td>
          <td>৳${baseUnitPrice.toFixed(2)}</td>
          <td>৳${discountAmount.toFixed(2)}</td>
          <td>৳${subtotal.toFixed(2)}</td>
        </tr>
      `;
    })
    .join("") || "";

  const htmlContent = `
    <html>
      <head>
        <title>Order Invoice - ${order.invoiceId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
          h1 { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          small { font-size: 0.85em; color: #555; }
        </style>
      </head>
      <body>
        <h1>Order Invoice: ${order.invoiceId}</h1>
        <p><strong>Order Date:</strong> ${orderDate}</p>
        <p><strong>Name:</strong> ${order.user?.name ?? ""}</p>
        <p><strong>Email:</strong> ${order.user?.email ?? ""}</p>
        <p><strong>Phone:</strong> ${order.user?.phone ?? ""}</p>
        <p><strong>Address:</strong> ${order.address?.fullAddress ?? ""}</p>

        <hr/>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product & Size</th>
              <th>Qty</th>
              <th>Unit Price (৳)</th>
              <th>Discount (৳)</th>
              <th>Subtotal (৳)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        <h3 style="text-align: right;">Grand Total: ৳${getOrderTotal(order).toFixed(2)}</h3>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
};


  const handleDeleteOrder = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteOrder(id).unwrap();
        toast.success("Order deleted successfully");
        Swal.fire("Deleted!", "Order deleted successfully.", "success");
      } catch {
        Swal.fire("Error!", "Failed to delete order.", "error");
        toast.error("Failed to delete order");
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Orders</h1>

      <div className="flex justify-center gap-2">
        <Input
          placeholder="Search by Invoice ID"
          value={searchInvoiceId}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchInvoiceId(e.target.value);
            setPage(1);
          }}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.invoiceId}</TableCell>
                  <TableCell>{order.user?.name}</TableCell>
                  <TableCell>{order.user?.email}</TableCell>

                  <TableCell>
                    <div className="min-w-36 space-y-1">
                      <Select
                        value={order.orderStatus}
                        onValueChange={(val) =>
                          handleUpdateStatus(order.invoiceId, val as OrderStatus)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {order.orderStatus === 'completed' && (
                        <span className="block text-xs font-medium text-green-700">Completed</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {order.paymentStatus === "success" ? (
                      <span className="text-green-600 font-semibold">paid</span>
                    ) : (
                      <Select
                        value={order.paymentStatus}
                        onValueChange={(val) =>
                          handleUpdatePaymentStatus(order.invoiceId, val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["pending", "success", "failed"].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>

                  <TableCell>৳{getOrderTotal(order).toFixed(2)}</TableCell>

                  <TableCell className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="gap-2"
                          onClick={() => setDraftItems(order.items.map((item) => {
                            const product = products.find((entry) => entry._id === String(item.productId));
                            return {
                              productId: String(item.productId),
                              quantity: item.quantity,
                              discount: item.discount ?? product?.discount ?? 0,
                              selectedSize: item.selectedSize ?? product?.sizes?.[0],
                            };
                          }))}
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit order - {order.invoiceId}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Order status</label>
                            <Select
                              value={order.orderStatus}
                              onValueChange={(value) =>
                                handleUpdateStatus(order.invoiceId, value as OrderStatus)
                              }
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map((status) => (
                                  <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Payment status</label>
                            <Select
                              value={order.paymentStatus}
                              onValueChange={(value) =>
                                handleUpdatePaymentStatus(order.invoiceId, value)
                              }
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["pending", "success", "failed"].map((status) => (
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
                                onClick={() => products[0] && setDraftItems((items) => [...items, {
                                  productId: products[0]._id,
                                  quantity: 1,
                                  discount: products[0].discount ?? 0,
                                  selectedSize: products[0].sizes?.[0],
                                }])}
                              >
                                Add product
                              </Button>
                            </div>
                            {draftItems.map((item, index) => (
                              <div key={index} className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
                                <select
                                  className="rounded-md border px-3 py-2 text-sm sm:col-span-2"
                                  value={item.productId}
                                  onChange={(event) => {
                                    const product = products.find((entry) => entry._id === event.target.value);
                                    setDraftItems((items) => items.map((entry, itemIndex) => itemIndex === index ? {
                                      ...entry,
                                      productId: event.target.value,
                                      discount: product?.discount ?? 0,
                                      selectedSize: product?.sizes?.[0],
                                    } : entry));
                                  }}
                                >
                                  {products.map((product) => <option key={product._id} value={product._id}>{product.title}</option>)}
                                </select>
                                <label className="space-y-1 text-xs font-medium">
                                  <span>Quantity</span>
                                  <Input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(event) => setDraftItems((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, quantity: Math.max(1, Number(event.target.value)) } : entry))}
                                  />
                                </label>
                                <label className="space-y-1 text-xs font-medium">
                                  <span>Discount (%)</span>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={item.discount}
                                    onChange={(event) => setDraftItems((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, discount: Math.min(100, Math.max(0, Number(event.target.value))) } : entry))}
                                  />
                                </label>
                                {(() => {
                                  const product = products.find((entry) => entry._id === item.productId);
                                  return product?.sizes?.length ? (
                                    <label className="space-y-1 text-xs font-medium sm:col-span-2">
                                      <span>Size</span>
                                      <select
                                        className="w-full rounded-md border px-3 py-2 text-sm"
                                        value={item.selectedSize?.label ?? ''}
                                        onChange={(event) => {
                                          const selectedSize = product.sizes?.find((size) => size.label === event.target.value);
                                          setDraftItems((items) => items.map((entry, itemIndex) => itemIndex === index ? { ...entry, selectedSize } : entry));
                                        }}
                                      >
                                        {product.sizes.map((size) => <option key={size.label} value={size.label}>{size.label} - Tk {size.price.toFixed(2)}</option>)}
                                      </select>
                                    </label>
                                  ) : <p className="text-xs text-gray-500 sm:col-span-2">No sizes available for this product</p>;
                                })()}
                                <Button className="sm:col-span-2" type="button" variant="destructive" size="sm" onClick={() => setDraftItems((items) => items.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              className="w-full"
                              disabled={isUpdatingItems || draftItems.length === 0}
                              onClick={() => saveOrderItems(order.invoiceId)}
                            >
                              {isUpdatingItems ? 'Saving...' : 'Save order products'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Order - {order.invoiceId}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 text-sm max-h-[70vh] overflow-y-auto pr-1">
                          <p>
                            <strong>Name:</strong> {order.user?.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {order.user?.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {order.address?.phone}
                          </p>
                          <p>
                            <strong>Address:</strong> {order.address?.fullAddress}
                          </p>
                          {order.completedAt && (
                            <p>
                              <strong>Completed:</strong>{' '}
                              {new Date(order.completedAt).toLocaleString()}
                            </p>
                          )}
                          <hr />
                          <h4 className="font-semibold">Order items</h4>
                          {order?.items?.map((item, idx) => (
                            <article key={`${item.productId}-${idx}`} className="rounded-lg border bg-gray-50 p-3 [&>h1]:hidden">
                              <div className="mb-2 flex items-center gap-3">
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white">
                                  <Image src={item.image || '/placeholder.png'} alt={item.title} fill className="object-cover" />
                                </div>
                                <strong className="break-words">{item.title}</strong>
                              </div>
                              <p>
                                {item.title} x {item.quantity} = ৳
                                {item?.price* item.quantity}

                              </p>
                                                  <p>
                      Size: {item?.selectedSize?.label} (৳{item?.selectedSize?.price?.toFixed(2)})
                    </p>
                    <p>Discount: 
                      <span className="text-red-600"> {item?.discount}%</span>

                    </p>

                    <h1>GrandTotal : ৳ {getOrderTotal(order).toFixed(2)}

                                </h1>
            


                            </article>
                          ))}
                          <div className="rounded-lg bg-gray-900 p-3 text-right font-semibold text-white">
                            Grand total: Tk {getOrderTotal(order).toFixed(2)}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      onClick={() => handlePrintOrder(order)}
                    >
                      Print
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      <MdDelete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {meta.total > ORDERS_PER_PAGE && (
        <Pagination className="justify-center mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  if (page > 1) handlePageChange(page - 1);
                }}
                style={{
                  pointerEvents: page === 1 ? "none" : "auto",
                  opacity: page === 1 ? 0.5 : 1,
                }}
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
                onClick={() => {
                  if (page < meta.totalPages) handlePageChange(page + 1);
                }}
                style={{
                  pointerEvents: page === meta.totalPages ? "none" : "auto",
                  opacity: page === meta.totalPages ? 0.5 : 1,
                }}
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

export default OrdersPage;
