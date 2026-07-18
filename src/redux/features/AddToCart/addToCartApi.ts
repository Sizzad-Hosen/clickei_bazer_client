import { baseApi } from "@/redux/api/baseApi";

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  discount?: number;
  quantity: number;
  image?: string;
  selectedSize?: { label: string; price: number };
}

interface CartResponse {
  data: { items: CartItem[]; totalAmount?: number; totalQuantity?: number };
}

interface CartQuantityRequest {
  data: { id: string; quantity: number };
}

const addToCartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Add to cart
    addCart: builder.mutation<unknown, { productId: string; quantity: number }>({
      query: (userInfo) => ({
        url: '/carts/add',
        method: 'POST',
        body: userInfo,
      }),
      invalidatesTags: ['Carts'], // ✅ This triggers getAllCarts re-fetch
    }),

    // Clear all cart items
    clearCart: builder.mutation<unknown, void>({
      query: () => ({
        url: '/carts/clear',
        method: 'POST',
      }),
      invalidatesTags: ['Carts'], // ✅ Refresh cart
    }),

    // Get all carts
    getAllCarts: builder.query<CartResponse, void>({
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
    updateCartsQuantity: builder.mutation<unknown, CartQuantityRequest>({
      query: ({ data }) => ({
        url: `/carts/update/${data.id}`,
        method: 'PATCH',
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
