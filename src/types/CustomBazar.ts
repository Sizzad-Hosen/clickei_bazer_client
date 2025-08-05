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
