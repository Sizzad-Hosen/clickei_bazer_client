export interface OrderItem {
  productId: string;
  title: string;
  image?: string;
  quantity: number;
  discount?: number;
  price: number;
   selectedSize: IProductSize; 
}

export interface IProductSize {
  label: string;
  price: number;
}


export interface Order {
  _id: string;
  invoiceId: string;
  status: string;
  selectedSize: IProductSize; 
  paymentStatus: string;
  paymentMethod?:string;

  discount?: number;
  totalPrice: number;
grandTotal:number;
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
