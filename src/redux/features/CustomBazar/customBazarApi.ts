// @/redux/features/CustomBazar/customBazarApi.ts
import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";
import { Order } from "@/types/order";
import { Product } from "@/types/products";

const customBazarApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => 
    ({
    addCustomBazarProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: "/customBazerProducts/create-customBazerProduct",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),

    addCustomBazarOrder: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: "/customBazerOrders/create-customBazerOrder",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),

    getAllCustomBazarProducts: builder.query<Product[], void>({
      query: () => "/customBazerProducts",
      providesTags: ["Products"],
    }),

getAllCustomBazarOrders: builder.query<{
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
      url: `/customBazerOrders?${params.toString()}`, 
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


updateCustomBazarOrderStatus: builder.mutation<
  Order, 
  { invoiceId: string; status: string }>({
  query: ({ invoiceId, status }) => ({
    url: `/customBazerOrders/status/${invoiceId}`, // correct interpolation with backticks
    method: 'PATCH', // or PATCH if you prefer
    body: { status }, // body must be an object (e.g. { status: "confirmed" })
  }),
  invalidatesTags: ['Products'], // or whatever tag you want to invalidate
}),


getAllCustomOrdersByUserId: builder.query({
  query: () => ({
    url: `/customBazerOrders/my-custom-orders`,
    method: 'GET',
  }),
  providesTags: ['Order'],
}),


    deleteCustomOrderById: builder.mutation({

      query: (id: string) => ({
        url: `/customBazerOrders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"], 
    }),


  }),
});

export const {
  useAddCustomBazarProductMutation,
  useGetAllCustomBazarProductsQuery,
  useAddCustomBazarOrderMutation,
  useGetAllCustomBazarOrdersQuery,
  useUpdateCustomBazarOrderStatusMutation,
  useGetAllCustomOrdersByUserIdQuery,
  useDeleteCustomOrderByIdMutation
} = customBazarApi;
