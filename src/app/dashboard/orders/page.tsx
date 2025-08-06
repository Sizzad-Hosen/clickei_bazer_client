"use client";

import React, { useState } from "react";
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
  useGetAllOrdersQuery,
  useUpdateOrderPaymentStatusMutation,
  useUpdateStatusMutation,


} from "@/redux/features/Order/ordersApi";

const ORDERS_PER_PAGE = 10;

const OrdersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchInvoiceId, setSearchInvoiceId] = useState("");

  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    page,
    limit: ORDERS_PER_PAGE,
    invoiceId: searchInvoiceId.trim() || undefined,
  });

  const [updateStatus] = useUpdateStatusMutation();
  
   const [updatePaymentStatus] = useUpdateOrderPaymentStatusMutation();

  const orders = data?.data?.data || [];
  console.log("data", orders)
  const meta = data?.data?.meta || {};

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleUpdateStatus = async (invoiceId: string, newStatus: string) => {
    try {
      await updateStatus({ invoiceId, status: newStatus }).unwrap();
      toast.success("Order status updated");
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

const handleUpdatePaymentStatus = async (invoiceId: string, newStatus: string) => {
  try {
   const res = await updatePaymentStatus({ invoiceId, status: newStatus }).unwrap(); 
console.log("res", res)
    toast.success("Payment status updated");

    refetch(); 
  } catch (error) {
    console.error(error);
    toast.error("Failed to update payment status");
  }
};
const handlePrintOrder = (order: any) => {
  const printWindow = window.open("", "PRINT", "width=800,height=800");
  if (!printWindow) return;

  const orderDate = new Date(order.createdAt).toLocaleString();

  const htmlContent = `
    <html>
      <head>
        <title>Order Invoice - ${order.invoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            line-height: 1.6;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          hr {
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <h1>Order Invoice: ${order.invoiceNumber}</h1>

        <div class="section">
          <strong>Order Date:</strong> ${orderDate}<br/>
          <strong>Name:</strong> ${order.user?.name}<br/>
          <strong>Email:</strong> ${order.user?.email}<br/>
          <strong>Phone:</strong> ${order.user?.phone}<br/>
          <strong>Address:</strong> 
          ${order.shippingAddress?.fullName}, 
          ${order.shippingAddress?.phone}, 
          ${order.shippingAddress?.address}, 
          ${order.shippingAddress?.city}, 
          ${order.shippingAddress?.postalCode}, 
          ${order.shippingAddress?.country}
        </div>

        <div class="section">
          <strong>Payment Method:</strong> ${order.paymentMethod}<br/>
          <strong>Payment Status:</strong> ${order.paymentStatus || "Pending"}<br/>
          <strong>Order Status:</strong> ${order.orderStatus}<br/>
        </div>

        <hr/>

        <div class="section">
          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price (৳)</th>
                <th>Subtotal (৳)</th>
              </tr>
            </thead>
            <tbody>
              ${order.cart?.items?.map((item: any, index: number) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.title}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${item.quantity * item.price}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <h3 style="text-align: right; margin-top: 20px;">
            Total Amount: ৳${order.totalPrice}
          </h3>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Orders</h1>
      <div className="flex gap-2 justify-center">
        <Input
          placeholder="Search by Invoice ID"
          value={searchInvoiceId}
          onChange={(e) => {
            setSearchInvoiceId(e.target.value);
            setPage(1);
          }}
          className="max-w-md"
        />
        <Button variant={"outline"} onClick={() => refetch()}>Search</Button>
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
              {orders.map((order: any) => (
                <TableRow key={order._id}>
                  <TableCell>{order.invoiceId}</TableCell>
                  <TableCell>{order.user?.name}</TableCell>
                  <TableCell>{order.user?.email}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(val) => handleUpdateStatus(order.invoiceId, val)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Select
                      defaultValue={order.paymentStatus}
                      onValueChange={(val) => handleUpdatePaymentStatus(order.invoiceId, val)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["pending" , "success" , "failed"].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>৳{order.totalPrice}</TableCell>

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
                          {order.cart?.items?.map((item: any, idx: number) => (
                            <div key={idx}>
                              <p>{item.title} x {item.quantity} = ৳{item.price * item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => handlePrintOrder(order)}>
                      Print
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
              <PaginationLink disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Prev</PaginationLink>
            </PaginationItem>
            {Array.from({ length: meta.totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={page === i + 1} onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationLink disabled={page === meta.totalPages} onClick={() => handlePageChange(page + 1)}>Next</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default OrdersPage;