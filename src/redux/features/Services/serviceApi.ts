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
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services'],
    }),



  }),
});

export const { useAddServiceMutation ,useGetAllServicesQuery} = servicesApi;