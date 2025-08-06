import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";
import { Order } from "@/types/order";


export const ordersApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

 
    getTrackOrderByInvoiceId: builder.mutation({
      query: (invoiceId: string) => ({
        url: `/orders/track/${invoiceId}`,
        method: "GET",
      }),
      invalidatesTags: ["Order"],
    }),

getAllOrdersByUserId: builder.query({
  query: () => ({
    url: `/orders/my-orders`,
    method: 'GET',
  }),
  providesTags: ['Order'],
}),



getAllOrders: builder.query<{
  data: Order[];
  meta: any;
}, Record<string, any>>({
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
      url: `/orders?${params.toString()}`, 
      method: 'GET',
    };
  },
  providesTags: ['Products'],

  transformResponse: (response: TResponseRedux<Order[]>) => {
    // Remove or keep console log if needed for debugging
   console.log("result", response);

    return {
      data: response.data,
      meta: response.meta,
    };
  },
}),
// ✅ Update Payment Status Mutation
updateOrderPaymentStatus: builder.mutation<
  Order, // ✅ Response type (if using TypeScript)
  { invoiceId: string; status: string } // ✅ Parameters for the mutation
>({
  query: ({ invoiceId, status }) => ({
    url: `/orders/update-paymentstatus/${invoiceId}`,
    method: 'PATCH',
    body: { status }, // ✅ Send the new status in body
  }),
  invalidatesTags: ['Orders'], // ✅ Optional: to refresh relevant cache
}),

updateStatus: builder.mutation<{ success: boolean; message: string },
  { invoiceId: string; status: string }>
  ({
  query: ({ invoiceId, status }) => ({
    url: `/orders/update-status/${invoiceId}`,
    method: "PATCH",
    body: { status },
  }),
  invalidatesTags: ["Order"],
}),

    deleteOrderById: builder.mutation({

      query: (id: string) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"], 
    }),

 
  }),
});



export const {
    useGetTrackOrderByInvoiceIdMutation,
 useUpdateStatusMutation,
    useGetAllOrdersQuery,
    useUpdateOrderPaymentStatusMutation,
   useGetAllOrdersByUserIdQuery,
   useDeleteOrderByIdMutation

} = ordersApi;
