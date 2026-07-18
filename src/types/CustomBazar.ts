import { TAddress } from "./user";

export type UnitType = 'kg' | 'gm' | 'piece' | 'litre';

export interface Subcategory {
  _id?: string;
  name: string;
  unit: UnitType;  
  pricePerUnit: number;
}

export interface Category {
  _id: string;
  category: string;
  subcategories: Subcategory[] | undefined

}
 

export interface Selection {
  selectedSub?: Subcategory; 
  quantity: number;
  unit: string;
}

export interface TCustomProduct extends Document {
  _id: string;          
  category: string;
  subcategories: Subcategory[]; 
  
}  


export interface TCustomBazerOrderItem {
  _id?: string;
  product: string;
  subcategoryName: string; 
  quantity: number;
  totalPrice: number;
  unit?:UnitType;
  pricePerUnit?:number
}

export type TPaymentStatus = "pending" |"paid"| "success" | "failed";
export const CUSTOM_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
] as const;
export type TCustomOrderStatus = (typeof CUSTOM_ORDER_STATUSES)[number];

type USER = {
  name:string;
  email:string;
  phone:string
}

export interface TCustomBazerOrder {
  _id?: string;
  orderItems: TCustomBazerOrderItem[];
  totalAmount: number;
  status: TCustomOrderStatus;
  paymentMethod: 'sslcommerz' | 'cash_on_delivery';
  paymentStatus?: TPaymentStatus;
  user?: USER
  address: TAddress;
  invoiceId?: string 
  siteNote?: string;
  deliveryOption: "insideRangpur" | "outsideRangpur";
  deletedByUser?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date | null;
}

