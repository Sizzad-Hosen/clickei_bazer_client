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
  data: Product[];
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
    return {
      data: response.data,
      meta: response.meta,
    };
  },
}),


  }),
});

export const {
  useAddCustomBazarProductMutation,
  useGetAllCustomBazarProductsQuery,
  useAddCustomBazarOrderMutation,
  useGetAllCustomBazarOrdersQuery
} = customBazarApi;
