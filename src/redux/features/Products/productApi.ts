import { baseApi } from "@/redux/api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (userInfo) => ({
        url: '/products/create-product',
        method: 'POST',
        body: userInfo,
      }),
    }),
    getAllProducts: builder.query({
      query: () => '/products',
      providesTags: ['Products'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

updateProduct: builder.mutation({
  query: ({ id, ...data }) => ({
    url: `/products/${id}`,
    method: 'PUT',
    body: data,
  }),
  invalidatesTags: ['Products'],
}),




  }),
});

export const { useAddProductMutation, useDeleteProductMutation, useGetAllProductsQuery, useUpdateProductMutation} = productApi;