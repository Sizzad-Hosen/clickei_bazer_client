import { baseApi } from "@/redux/api/baseApi";


export const trackOrderApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

 
    getTrackOrderByInvoiceId: builder.mutation({
      query: (invoiceId: string) => ({
        url: `/orders/track/${invoiceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
    updateTrackOrderByInvoiceId: builder.mutation({
      query: (invoiceId: string) => ({
        url: `/orders/update-status/${invoiceId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Order"],
    }),

 
  }),
});

export const {
    useGetTrackOrderByInvoiceIdMutation,
    useUpdateTrackOrderByInvoiceIdMutation

} = trackOrderApi;
