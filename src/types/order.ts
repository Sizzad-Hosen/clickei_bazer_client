export interface OrderItem {
  productId: string;
  title: string;
  image?: string;
  quantity: number;
  discount?: number;
  price: number;
  selectedSize?: IProductSize;
}

export interface IProductSize {
  label: string;
  price: number;
}

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "confirmed",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];


export interface Order {
  _id: string;
  invoiceId: string;
  status: string;
  selectedSize?: IProductSize;
  paymentStatus: string;
  paymentMethod?:string;

  discount?: number;
  totalPrice: number;
  /** Legacy field; current API responses use totalPrice. */
  grandTotal?: number;
  orderStatus: OrderStatus;
  completedAt?: string | null;
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
  items: OrderItem[];
  // other fields...
}

export const getOrderTotal = (order: Pick<Order, 'totalPrice' | 'grandTotal'>) =>
  order.totalPrice ?? order.grandTotal ?? 0;
