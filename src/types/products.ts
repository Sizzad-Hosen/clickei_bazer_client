// Service
export interface Service {
  _id: string;
  name: string;
  slug?: string;
}

// Category belongs to Service
export interface Category {
  _id: string;
  name: string;
  serviceId: string;
}

// Subcategory belongs to Category
export interface Subcategory {
  _id: string;
  name: string;
  categoryId: string;
}

// Product belongs to Subcategory

// Generic API response structure
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
}
