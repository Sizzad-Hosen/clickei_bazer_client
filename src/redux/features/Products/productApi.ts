import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse, TMeta, TResponseRedux } from "@/types/global";
import { Product } from "@/types/products";

export type TPaginationMeta = {
  total: number;
  page: number;
  limit: number;
};

interface ProductsResponse {
  data: Product[];
  meta: TMeta;
}
interface ProductsApiResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    meta: TMeta;
  };
}

export type TSearchQueryParams = Record<string, string | number | undefined>;

export interface IProductSize {
  label: string;
  price: number;
}

export interface TUpdateProductPayload {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  price?: number;
  stock?: string; // your quantity
  sizes?: IProductSize[]; // ✅ Add this
}


const productApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

addProduct: builder.mutation<Product, FormData>({
  query: (formData) => ({
    url: '/products/create-product',
    method: 'POST',
    body: formData,
  }),
}),


    getAllProductsBySearch: builder.query<
      { data: Product[]; meta: TPaginationMeta },
      TSearchQueryParams
    >({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, String(value));
            }
          });
        }

        return {
          url: `/products?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Products'],
      transformResponse: (response: TResponseRedux<Product[]>) => {
        return {
          data: response.data ?? [],
          meta: response.meta as TPaginationMeta,
        };
      },
    }),

getAllProducts: builder.query<
  { data: Product[]; meta: TMeta },   // transformed return type
  { page?: number; limit?: number }  // query arg type
>({
  query: ({ page = 1, limit = 6 } = {}) => `/products?page=${page}&limit=${limit}`,
transformResponse: (response: ApiResponse<Product>) => ({
  data: response.data.data,
  meta: response.data.meta ?? {
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 6,  
  },
}),

  providesTags: ['Products'],
}),


   getAllRecentProductsBySubcategory: builder.query<
      ProductsResponse,
      {  page?: number; limit?: number }
    >({
      query: ({  page = 1, limit = 10 }) =>
        `/products/sub-products?&page=${page}&limit=${limit}`,
      // Use typed response here instead of `any`
  
  transformResponse: (response: ApiResponse<Product[]>): ProductsResponse => {
    // Access the correct `data` level; no extra nesting
   const products: Product[] = Array.isArray(response?.data?.data)
      ? response.data.data.flat()
      : [];

    return {
      data: products,
      meta: response?.data?.meta ?? { totalPages: 1, total: 0, page: 1, limit: 10 },
    };
  },
      providesTags: ['Products'],
    }),
    
getSingleProduct: builder.query<Product, string>({
  query: (id) => `/products/${id}`,
  transformResponse: (response: { data: Product }) => response.data,
  providesTags: (result, error, id) => [{ type: 'Products', id }],
}),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

  updateProduct: builder.mutation<void, { id: string; formData: FormData }>({
  query: ({ id, formData }) => ({
    url: `/products/${id}`,
    method: 'PATCH',
    body: formData, // send FormData directly
    // Do NOT set headers, browser will handle it
  }),
  invalidatesTags: ['Products'],
}),

// this is subcategory api but use this page by mistake
getAllProductsBySubcategoryId: builder.query<
  ProductsResponse, // return type
  { subcategoryId: string; page?: number; limit?: number } // query params
>({
  query: ({ subcategoryId, page = 1, limit = 10 }) =>
    `/subCategories/allProductsBySubId/${subcategoryId}?page=${page}&limit=${limit}`,

  transformResponse: (response: ProductsApiResponse): ProductsResponse => {
    return {
      data: response.data.products,
      meta: response.data.meta,
    };
  },
}),


  }),
});

export const {
  useGetAllProductsBySearchQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useGetAllProductsBySubcategoryIdQuery,
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useGetSingleProductQuery,
  useGetAllRecentProductsBySubcategoryQuery,
} = productApi;
