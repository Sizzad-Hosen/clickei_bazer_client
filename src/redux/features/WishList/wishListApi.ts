import { baseApi } from "@/redux/api/baseApi";


export const wishListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    addToWishlist: builder.mutation({

      query: (productId: string) => ({

        url: "/wishlists/add",
        method: "POST",
        body: { productId },
      }),

      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId: string) => ({
        url: `/wishlists/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    getWishlist: builder.query({
      query: () => "/wishlists",
      providesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} = wishListApi;
