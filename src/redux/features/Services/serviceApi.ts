import { baseApi } from "@/redux/api/baseApi";

const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (userInfo) => ({
        url: '/services/create-service',
        method: 'POST',
        body: userInfo,
      }),
    }),
    getAllServices: builder.query({
      query: () => '/services',
      providesTags: ['Services'],
    }),
getSingelServices: builder.query({
  query: ({ serviceId }) => `/services/${serviceId}`,
  providesTags: ['Services'],
}),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services'],
    }),

updateService: builder.mutation({
  query: ({ id, ...data }) => ({
    url: `/services/${id}`,
    method: 'PUT',
    body: data,
  }),
  invalidatesTags: ['Services'],
}),

serviceFullTree: builder.query({
  query: (id: string) => `/services/${id}/categories-subcategories-products`,
  providesTags: ['Services'],
}),


  }),
});

export const { useAddServiceMutation ,useGetSingelServicesQuery,useGetAllServicesQuery , useDeleteServiceMutation , useUpdateServiceMutation, useLazyServiceFullTreeQuery} = servicesApi;