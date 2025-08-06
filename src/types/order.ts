interface Product {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  invoiceId: string;
  user: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  orderItems: {
    product: Product;
    quantity: number;
  }[];
}
