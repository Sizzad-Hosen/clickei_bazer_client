// @/types/products.ts
export interface Product {
  _id?: string;
  category: string;
  subcategories: {
    name: string;
    unit: string;
    pricePerUnit: number;
  }[];
}



export interface TCustomBazerOrderItem {
  product: Product         // Ref to main product (e.g., Fruits)
  subcategoryName: string;          // e.g., "Apple" - must be in product.subcategories[]
  quantity: number;                 // e.g., 2 kg or 10 pieces
  unit: 'kg' | 'gm' | 'piece' | 'litre'; // match the subcategory unit
  pricePerUnit: number;            // From subcategory
  totalPrice: number;              // quantity * pricePerUnit
}

export type TPaymentStatus = "pending" |"paid"| "success" | "failed";


export interface TCustomBazerOrder {
 _id:string
  orderItems: TCustomBazerOrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: 'sslcommerz' | 'cash_on_delivery';
  paymentStatus?: TPaymentStatus;
  address: {
    fullName: string;
    phoneNumber: string;
    fullAddress: string;
  };
  invoiceId:string;
  siteNote?: string;
  deliveryOption: "insideRangpur" | "outsideRangpur"
  deletedByUser?: boolean; 
  createdAt?: Date;
  updatedAt?: Date;
}
