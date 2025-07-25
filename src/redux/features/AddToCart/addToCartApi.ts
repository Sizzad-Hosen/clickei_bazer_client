import { baseApi } from "@/redux/api/baseApi";

const addToCartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    addCart: builder.mutation({

      query: (userInfo) => ({
        url: '//carts/add',
        method: 'POST',
        body: userInfo,
      }),
    }),
    
    getAllCarts: builder.query({
      query: () => '/carts',
      providesTags: ['Carts'],
    }),

    deleteCart: builder.mutation({
      query: () => ({
        url: `/categories/remove`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Carts'],
    }),

updateCartsQuantity: builder.mutation({
  query: ({data }) => ({
    url: `/carts/update`,
    method: 'PUT',
    body: data,
  }),
  invalidatesTags: ['Carts'],
}),




  }),
});

export const { useAddCartMutation, useDeleteCartMutation, useGetAllCartsQuery,useUpdateCartsQuantityMutation} = addToCartApi