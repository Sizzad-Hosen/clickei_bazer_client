// @/redux/features/CustomBazar/customBazarApi.ts
import { baseApi } from "@/redux/api/baseApi";
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
  }),
});

export const {
  useAddCustomBazarProductMutation,
  useGetAllCustomBazarProductsQuery,
  useAddCustomBazarOrderMutation
} = customBazarApi;
