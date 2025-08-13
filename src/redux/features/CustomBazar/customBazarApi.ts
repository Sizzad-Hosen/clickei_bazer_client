
import { baseApi } from "@/redux/api/baseApi";
import { TCustomBazerOrder, TCustomProduct } from "@/types/CustomBazar";
import { ApiResponse, TMeta, TResponseRedux } from "@/types/global";


/** Query params type for search/pagination */
export type TQueryParams = Record<string, string | number | undefined>;

/** Raw meta shape that backend might return (either totalPage or totalPages) */
export type TRawMeta = {
  total?: number;
  totalPage?: number;
  totalPages?: number;
  limit?: number;
  page?: number;
};




interface TCustomBazarProductsResponse {
  data: TCustomProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}


export interface CustomOrdersApiResponse {
  data: TCustomBazerOrder[];
  meta: TMeta;
}


const customBazarApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
  
    
    addCustomBazarProduct: builder.mutation<TCustomProduct, Partial<TCustomProduct>>({
      query: (product) => ({
        url: "/customBazerProducts/create-customBazerProduct",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["CustomProducts"],
    }),

 
    addCustomBazarOrder: builder.mutation<TCustomBazerOrder, Partial<TCustomBazerOrder>>({
      query: (orderPayload) => ({
        url: "/customBazerOrders/create-customBazerOrder",
        method: "POST",
        body: orderPayload,
      }),
      invalidatesTags: ["CustomOrder"],
    }),

getAllCustomBazarProducts: builder.query<TCustomBazarProductsResponse, void>({
  query: () => "/customBazerProducts",
  providesTags: ["CustomProducts"],
  transformResponse: (response: ApiResponse<TCustomProduct>) => {
    console.log("res", response.data.data)

    return {
      data: response.data.data, 
      meta: response.data.meta ?? { total: 0, totalPages: 0, limit: 0, page: 1 },
    };
  },
}),

    // fetch all custom bazar orders (with query params)
getAllCustomBazarOrders: builder.query<
  CustomOrdersApiResponse,
  TQueryParams
>({
  query: (args) => {
    const params = new URLSearchParams();

    if (args) {
      Object.entries(args).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    return {
      url: `/customBazerOrders?${params.toString()}`,
      method: "GET",
    };
  },

  providesTags: ["CustomOrder"],

  transformResponse: (response: ApiResponse<TCustomBazerOrder>) => ({
  
    data: response.data.data,  // must be a flat array
    meta: response.data.meta ?? { total: 0, totalPages: 0, limit: 0, page: 1 },
  }),
}),

    // update status of a custom bazar order (returns updated order)
    updateCustomBazarOrderStatus: builder.mutation<
      TCustomBazerOrder,
      { invoiceId: string; status: string }
    >({
      query: ({ invoiceId, status }) => ({
        url: `/customBazerOrders/status/${invoiceId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["CustomOrder"],
    }),

    // get all custom orders for the current user (keep wrapper if your API uses wrapper)
    getAllCustomOrdersByUserId: builder.query<TResponseRedux<TCustomBazerOrder[]>, void>({
      query: () => ({
        url: `/customBazerOrders/my-custom-orders`,
        method: "GET",
      }),
      providesTags: ["CustomOrder"],
    }),

    // delete custom order
    deleteCustomOrderById: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/customBazerOrders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CustomOrder"],
    }),

    // delete custom product
    deleteCustomProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customBazerProducts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CustomProducts"],
    }),

    // update a custom product (returns updated Product)
    updateCustomBazarProduct: builder.mutation<
     TCustomProduct,
      { id: string; data: Partial<TCustomProduct> }
    >({
      query: ({ id, data }) => ({
        url: `/customBazerProducts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CustomProducts"],
    }),

    // update payment status for a custom order (returns updated custom order)
    updateCustomOrderPaymentStatus: builder.mutation<
      TCustomBazerOrder,
      { invoiceId: string; status: string }
    >({
      query: ({ invoiceId, status }) => ({
        url: `/customBazerOrders/update-paymentstatus/${invoiceId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["CustomOrder"],
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
  useDeleteCustomOrderByIdMutation,
  useDeleteCustomProductMutation,
  useUpdateCustomBazarProductMutation,
  useUpdateCustomOrderPaymentStatusMutation,
} = customBazarApi;

export default customBazarApi;
