import { baseApi } from "@/redux/api/baseApi";

const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (userInfo) => ({
        url: '/services/create-service',
        method: 'POST',
        body: userInfo,
      }),
      invalidatesTags: ['Services'],
    }),
    getAllServices: builder.query({
      query: () => '/services',
      providesTags: ['Services'],
      keepUnusedDataFor: 600,
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
  query: (id: string) => ({
    url: `/services/${id}/full-tree`,
    params: { includeProducts: false },
  }),
  providesTags: ['Services'],
  keepUnusedDataFor: 300,
 
}),
serviceHomeFullTree: builder.query({
  query: (id: string) => ({
    url: `/services/${id}/full-tree`,
    params: { includeProducts: false },
  }),
  providesTags: ['Services'],
  keepUnusedDataFor: 300,
 
}),


  }),
});

export const { useAddServiceMutation ,useGetSingelServicesQuery,useGetAllServicesQuery , useDeleteServiceMutation , useUpdateServiceMutation,useServiceHomeFullTreeQuery,useLazyServiceHomeFullTreeQuery, useLazyServiceFullTreeQuery} = servicesApi;
