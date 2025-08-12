export interface OrderItem {
  productId: string;
  title: string;
  image?: string;
  quantity: number;
  price: number;
}


export interface Order {
  _id: string;
  invoiceId: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
totalAmount?:number;
  orderStatus:string;
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
