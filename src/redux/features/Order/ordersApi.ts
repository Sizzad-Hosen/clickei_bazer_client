import { baseApi } from "@/redux/api/baseApi";
interface OrdersApiResponse {
  data: Order[];
  meta: {
    total: number;
    totalPages: number;
  limit: number;
  page: number;
  };
}
import { TMeta, TResponseRedux } from "@/types/global";
import { Order } from "@/types/order";

function normalizeMeta(meta?: Partial<TMeta>): TMeta {
  return {
    total: meta?.total ?? 0,
    totalPages: meta?.totalPages ?? 0,
    limit: meta?.limit ?? 0,
    page: meta?.page ?? 1,
  };
}


export const ordersApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

 
    getTrackOrderByInvoiceId: builder.mutation({
      query: (invoiceId: string) => ({
        url: `/orders/track/${invoiceId}`,
        method: "GET",
      }),
      invalidatesTags: ["Orders"],
    }),

      addOrder: builder.mutation({
      query: (userInfo) => ({
        url: '/orders/create-order',
        method: 'POST',
        body: userInfo,
      }),
    }),

getAllOrdersByUserId: builder.query({
  query: () => ({
    url: `/orders/my-orders`,
    method: 'GET',
  }),
  providesTags: ['Orders'],
}),

getAllOrders: builder.query<OrdersApiResponse, Record<string, any>>({
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
  providesTags: ['Orders'],

  transformResponse: (response: TResponseRedux<Order[]>) => {
    console.log("result", response);
    return {
      data: response.data ?? [],
    meta: normalizeMeta(response.meta),
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
  invalidatesTags: ["Orders"],
}),

    deleteOrderById: builder.mutation({

      query: (id: string) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"], 
    }),

 
  }),
});



export const {
    useGetTrackOrderByInvoiceIdMutation,
 useUpdateStatusMutation,
    useGetAllOrdersQuery,
    useUpdateOrderPaymentStatusMutation,
   useGetAllOrdersByUserIdQuery,
   useDeleteOrderByIdMutation,
   useAddOrderMutation

} = ordersApi;
