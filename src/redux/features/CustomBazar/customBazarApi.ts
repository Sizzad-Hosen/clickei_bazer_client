// src/redux/features/CustomBazar/customBazarApi.ts
import { baseApi } from "@/redux/api/baseApi";
import { TCustomBazerOrder } from "@/types/CustomBazar";
import { TResponseRedux } from "@/types/global";
import { Order } from "@/types/order";
import { Product } from "@/types/products";

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

/** Normalized meta shape used across the frontend */
export type TMeta = {
  total: number;
  totalPages: number;
  limit: number;
  page: number;
};

/** Normalizes backend meta (handles `totalPage` or `totalPages`) */
function normalizeMeta(meta?: TRawMeta): TMeta {
  return {
    total: meta?.total ?? 0,
    totalPages: meta?.totalPages ?? meta?.totalPage ?? 0,
    limit: meta?.limit ?? 0,
    page: meta?.page ?? 1,
  };
}


export interface CustomOrdersApiResponse {
  data: TCustomBazerOrder[];
  meta: TMeta;
}

const customBazarApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // create a custom product (returns Product)
    addCustomBazarProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: "/customBazerProducts/create-customBazerProduct",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["CustomOrder"],
    }),

    // create a custom bazar order (returns the created order)
    addCustomBazarOrder: builder.mutation<TCustomBazerOrder, Partial<TCustomBazerOrder>>({
      query: (orderPayload) => ({
        url: "/customBazerOrders/create-customBazerOrder",
        method: "POST",
        body: orderPayload,
      }),
      invalidatesTags: ["CustomOrder"],
    }),

    // fetch all custom products
    getAllCustomBazarProducts: builder.query<Product[], void>({
      query: () => "/customBazerProducts",
      providesTags: ["CustomOrder"],
    }),

    // fetch all custom bazar orders (with query params)
    getAllCustomBazarOrders: builder.query<CustomOrdersApiResponse, TQueryParams>({
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
      transformResponse: (response: TResponseRedux<TCustomBazerOrder[]>) => {
        return {
          data: response.data ?? [],
          meta: normalizeMeta(response.meta as TRawMeta),
        };
      },
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
      invalidatesTags: ["CustomOrder"],
    }),

    // update a custom product (returns updated Product)
    updateCustomBazarProduct: builder.mutation<
      Product,
      { id: string; data: Partial<Product> }
    >({
      query: ({ id, data }) => ({
        url: `/customBazerProducts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["CustomOrder"],
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
