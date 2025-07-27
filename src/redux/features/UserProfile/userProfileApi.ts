import { baseApi } from "@/redux/api/baseApi";

const userProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

   
addProfile: builder.mutation({
  query: (formData) => ({
    url: '/customers/create-customer',
    method: 'POST',
    body: formData,
  }),

  transformResponse: (response) => response,
  invalidatesTags: ['Profile'],
}),

    getSingelProfile: builder.query({
      query: (id) => `/customers/${id}`, 
      providesTags: ['Profile'],
    }),

    getCustomerDetails: builder.query({
      query: () => `/customers/customerDetails`, 
      providesTags: ['Profile'],
    }),

    deleteProfile: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    
 updateProfile: builder.mutation({
  query: ({ id, body }) => ({
    url: `/customers/${id}`,
    method: 'PATCH',
    body, // FormData passed directly
  }),
  invalidatesTags: ['Profile'],
}),

  }),
});

export const {
  useAddProfileMutation,
  useDeleteProfileMutation,
    useGetSingelProfileQuery,
  useUpdateProfileMutation,
 useGetCustomerDetailsQuery
} = userProfileApi;
