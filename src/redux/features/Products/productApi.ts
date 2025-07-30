import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";
import { Product } from "@/types/products";

export type TQueryParams = Record<string, string | undefined>;

const productApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    addProduct: builder.mutation({
      query: (userInfo) => ({
        url: '/products/create-product',
        method: 'POST',
        body: userInfo,
      }),
    }),

    // Fixed getAllProductsBySearch to accept an object instead of array
 getAllProductsBySearch: builder.query<{
  data: Product[];
  meta: any;
}, Record<string, any>>({
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
      url: `/products?${params.toString()}`, // <-- build full URL with query string here
      method: 'GET',
    };
  },
  providesTags: ['Products'],
  transformResponse: (response: TResponseRedux<Product[]>) => {
    return {
      data: response.data,
      meta: response.meta,
    };
  },
}),


    getAllProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Products'],
    }),

    getSingleProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation<void, { id: string; [key: string]: any }>({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),

    getAllProductsBySubcategoryId: builder.query<Product[], { subcategoryId: string; page?: number; limit?: number }>({
      query: ({ subcategoryId, page = 1, limit = 10 }) =>
        `/subCategories/allProductsBySubId/${subcategoryId}?page=${page}&limit=${limit}`,
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
} = productApi;
