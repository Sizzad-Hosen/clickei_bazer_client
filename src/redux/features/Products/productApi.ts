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
  getSingleProduct: builder.query({
  query: (id: string) => `/products/${id}`,  // pass product id here
  providesTags: (result, error, id) => [{ type: 'Products', id }],
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

  getAllProductsBySubcategoryId: builder.query({

      query: (subcategoryId: string) => `/subCategories/allProductsBySubId/${subcategoryId}`,

    }),


  }),
});

export const { useAddProductMutation, useDeleteProductMutation,useGetAllProductsBySubcategoryIdQuery, useGetAllProductsQuery, useUpdateProductMutation, useGetSingleProductQuery} = productApi;