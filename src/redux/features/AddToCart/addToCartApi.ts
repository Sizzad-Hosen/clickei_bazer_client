import { baseApi } from "@/redux/api/baseApi";

const addToCartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Add to cart
    addCart: builder.mutation({
      query: (userInfo) => ({
        url: '/carts/add',
        method: 'POST',
        body: userInfo,
      }),
      invalidatesTags: ['Carts'], // ✅ This triggers getAllCarts re-fetch
    }),

    // Clear all cart items
    clearCart: builder.mutation({
      query: (userInfo) => ({
        url: '/carts/clear',
        method: 'POST',
        body: userInfo,
      }),
      invalidatesTags: ['Carts'], // ✅ Refresh cart
    }),

    // Get all carts
    getAllCarts: builder.query({
      query: () => '/carts',
      providesTags: ['Carts'], // ✅ Data source tag
    }),

    // Remove single item
    removeCart: builder.mutation<void, string>({
      query: (id) => ({
        url: `/carts/remove/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Carts'], // ✅ Refresh cart after removing
    }),

    // Update cart quantity
    updateCartsQuantity: builder.mutation({
      query: ({ data }) => ({
        url: `/carts/update/${data.id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Carts'], // ✅ Refresh cart after update
    }),

  }),
});

export const { 
  useAddCartMutation,
  useClearCartMutation,
  useRemoveCartMutation,
  useGetAllCartsQuery,
  useUpdateCartsQuantityMutation
} = addToCartApi;
