// Service
export interface Service {
  _id: string;
  name: string;
  slug?: string;
}
// ----------------------
// TYPE DEFINITIONS
// ----------------------
export interface CategoryRef {
  _id: string;
  name: string;
}

export interface SubcategoryRef {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
  category?: CategoryRef; 
  serviceId: string;
  subcategories?: Subcategory[]; 
}


export interface Subcategory {
  _id: string;
  name: string;
  unit?: string;
  pricePerUnit?: string;
  categoryId: string;
  subcategory?: SubcategoryRef;
}

export interface ApiResponse<T> {
  status: 'success' | 'fail';
  message?: string;
  data: T;
}

export interface Product {
  _id: string;
  name: string;
  title: string;
  description: string;
  quantity: number;
  price: number;
  images?: string[];
  isPublished:boolean;
  discount:number
  subcategoryId?: string;
categoryId: string | { _id: string; [key: string]: unknown };

  serviceId?: string;  
}
