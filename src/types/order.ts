export interface Order {
  _id: string;
  invoiceId: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  cart?: {
    items: {
      title: string;
      quantity: number;
      price: number;
    }[];
  };
  address?: {
    phone?: string;
    fullAddress?: string;
  };
  createdAt?: string;
  // other fields...
}
