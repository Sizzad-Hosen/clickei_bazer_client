import { baseApi } from "@/redux/api/baseApi";


export const trackOrderApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

 
    getTrackOrderByInvoiceId: builder.mutation({
      query: (invoiceId: string) => ({
        url: `/orders/track/${invoiceId}`,
        method: "GET",
      }),
      invalidatesTags: ["Order"],
    }),

updateTrackOrderByInvoiceId: builder.mutation<{ success: boolean; message: string },
  { invoiceId: string; status: string }>
  ({
  query: ({ invoiceId, status }) => ({
    url: `/orders/update-status/${invoiceId}`,
    method: "PATCH",
    body: { status },
  }),
  invalidatesTags: ["Order"],
})

 
  }),
});

export const {
    useGetTrackOrderByInvoiceIdMutation,
    useUpdateTrackOrderByInvoiceIdMutation

} = trackOrderApi;
