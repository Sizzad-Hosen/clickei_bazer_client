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
import { ApiResponse, TQueryParam } from "@/types/global";
import { Order } from "@/types/order";


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

getAllOrdersCount: builder.query<ApiResponse<Order>, void>({
  query: () => '/orders',
  providesTags: ['Orders'],
}),

getAllOrders : builder.query<OrdersApiResponse, TQueryParam>({
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
  transformResponse: (response: ApiResponse<Order>) => ({
    data: response.data?.data,
    meta: response.data.meta ?? { total: 0, totalPages: 0, limit: 0, page: 1 },
  }),
}),


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
   useAddOrderMutation,
   useGetAllOrdersCountQuery

} = ordersApi;
