import { baseApi } from "@/redux/api/baseApi";

const addToCartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    addCart: builder.mutation({

      query: (userInfo) => ({
        url: '/carts/add',
        method: 'POST',
        body: userInfo,
      }),
    }),

    clearCart: builder.mutation({

      query: (userInfo) => ({
        url: '/carts/clear',
        method: 'POST',
        body: userInfo,
      }),
    }),
    
    getAllCarts: builder.query({
      query: () => '/carts',
      providesTags: ['Carts'],
    }),

    removeCart: builder.mutation<void, string>({
  query: (id) => ({
    url: `/carts/remove/${id}`,
    method: 'DELETE',
  }),
}),

updateCartsQuantity: builder.mutation({
  query: ({data}) => ({
    url: `/carts/update/${data.id}`,
    method: 'POST',
    body: data,
  }),
  invalidatesTags: ['Carts'],
}),




  }),
});

export const { useAddCartMutation,useClearCartMutation, useRemoveCartMutation, useGetAllCartsQuery,useUpdateCartsQuantityMutation} = addToCartApi