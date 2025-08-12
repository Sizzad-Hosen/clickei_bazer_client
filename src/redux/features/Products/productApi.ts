import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";
import { Product } from "@/types/products";

export type TPaginationMeta = {
  total: number;
  page: number;
  limit: number;
};

export type TSearchQueryParams = Record<string, string | number | undefined>;

export type TUpdateProductPayload = {
  id: string;
  [key: string]: string | number | undefined;
};

const productApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (productInfo) => ({
        url: '/products/create-product',
        method: 'POST',
        body: productInfo,
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
      TResponseRedux<Product[]>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 6 } = {}) => `/products?page=${page}&limit=${limit}`,
      providesTags: ['Products'],
    }),

    getAllProductsBySubcategory: builder.query<
      TResponseRedux<Product[]>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 6 } = {}) => `/products/sub-products?page=${page}&limit=${limit}`,
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

    updateProduct: builder.mutation<void, TUpdateProductPayload>({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),

    getAllProductsBySubcategoryId: builder.query<
      Product[],
      { subcategoryId: string; page?: number; limit?: number }
    >({
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
  useGetAllProductsBySubcategoryQuery
} = productApi;
