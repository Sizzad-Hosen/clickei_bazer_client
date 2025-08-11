'use client';

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
} from "@/components/ui/pagination";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import {
  useDeleteOrderByIdMutation,
  useGetAllOrdersQuery,
  useUpdateOrderPaymentStatusMutation,
  useUpdateStatusMutation,
} from "@/redux/features/Order/ordersApi";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import Image from "next/image"; // Import Next.js Image

const ORDERS_PER_PAGE = 10;

// Define interfaces to avoid `any`
interface User {
  name?: string;
  email?: string;
  phone?: string;
}

interface CartItem {
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Cart {
  items: CartItem[];
}

interface Order {
  _id: string;
  invoiceId: string;

  user?: User;
  cart?: Cart;
  createdAt?: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  address?: {
    phone?: string;
    fullAddress?: string;
  };
}

const OrdersPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchInvoiceId, setSearchInvoiceId] = useState<string>("");
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  


const { data, isLoading } = useGetAllOrdersQuery({
  page,
  limit: ORDERS_PER_PAGE,
  invoiceId: searchInvoiceId.trim() || undefined,
});

// then
const orders: Order[] = localOrders.length ? localOrders : data?.data?.data || [];
console.log("orders", orders)
const meta = data?.data?.meta || { total: 0, totalPages: 0 };

  const [updateStatus] = useUpdateStatusMutation();
  const [updatePaymentStatus] = useUpdateOrderPaymentStatusMutation();
  const [deleteOrder] = useDeleteOrderByIdMutation();


  useEffect(() => {
    if (data?.data) {
      setLocalOrders(data.data);
    }
  }, [data]);

  const handlePageChange = (newPage: number) => setPage(newPage);

  // Type the status params strictly if possible
  const handleUpdateStatus = async (invoiceId: string, newStatus: string) => {
    try {
      await updateStatus({ invoiceId, status: newStatus }).unwrap();
      setLocalOrders((prev) =>
        prev.map((o) => (o.invoiceId === invoiceId ? { ...o, status: newStatus } : o))
      );
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleUpdatePaymentStatus = async (invoiceId: string, newStatus: string) => {
    try {
      await updatePaymentStatus({ invoiceId, status: newStatus }).unwrap();
      setLocalOrders((prev) =>
        prev.map((o) =>
          o.invoiceId === invoiceId ? { ...o, paymentStatus: newStatus } : o
        )
      );
      toast.success("Payment status updated");
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  // Fix: use typed `order: Order`
  const handlePrintOrder = (order: Order) => {
    const printWindow = window.open("", "PRINT", "width=800,height=800");
    if (!printWindow) return;

    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : '';

    const itemsHTML = order.cart?.items
      .map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.title}</td>
          <td>${item.quantity}</td>
          <td>${item.price}</td>
          <td>${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `).join("") || '';

    const htmlContent = `
      <html>
        <head>
          <title>Order Invoice - ${ order.invoiceId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            h1 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Order Invoice: ${ order.invoiceId}</h1>
          <p><strong>Order Date:</strong> ${orderDate}</p>
          <p><strong>Name:</strong> ${order.user?.name ?? ''}</p>
          <p><strong>Email:</strong> ${order.user?.email ?? ''}</p>
          <p><strong>Phone:</strong> ${order.user?.phone ?? ''}</p>
          <hr/>
          <table>
            <thead>
              <tr><th>#</th><th>Product</th><th>Qty</th><th>Unit Price (৳)</th><th>Subtotal (৳)</th></tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          <h3 style="text-align: right;">Total Amount: ৳${order.totalPrice.toFixed(2)}</h3>
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
        setLocalOrders((prev) => prev.filter((o) => o._id !== id));
        Swal.fire("Deleted!", "Order deleted successfully.", "success");
        toast.success("Order deleted successfully");
      } catch {
        Swal.fire("Error!", "Failed to delete order.", "error");
        toast.error("Failed to delete order");
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Orders</h1>
      <div className="flex gap-2 justify-center">
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

                  {/* Order Status */}
                  <TableCell>
                    {order.status === "shipped" ? (
                      <span className="text-blue-600 font-semibold">shipped</span>
                    ) : (
                      <Select
                        value={order.status}
                        onValueChange={(val) =>
                          handleUpdateStatus(order.invoiceId, val)
                        }
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(
                            (s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>

                  {/* Payment Status */}
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
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["pending", "success", "failed"].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>

                  {/* Total */}
                  <TableCell>৳{order.totalPrice.toFixed(2)}</TableCell>

                  {/* Actions */}
                  <TableCell className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Order - {order.invoiceId}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
                          <p><strong>Name:</strong> {order.user?.name}</p>
                          <p><strong>Email:</strong> {order.user?.email}</p>
                          <p><strong>Phone:</strong> {order.address?.phone}</p>
                          <p><strong>Address:</strong> {order.address?.fullAddress}</p>
                          <hr />
                          <h4 className="font-semibold">Items:</h4>
                          {order.cart?.items?.map((item, idx) => (
                            <div key={idx}>
                              <p>
                                {item.title} x {item.quantity} = ৳
                                {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => handlePrintOrder(order)}>
                      Print
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteOrder(order._id)}>
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
                  if (page !== 1) handlePageChange(page - 1);
                }}
                style={{ pointerEvents: page === 1 ? "none" : "auto", opacity: page === 1 ? 0.5 : 1 }}
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

export default OrdersPage;
