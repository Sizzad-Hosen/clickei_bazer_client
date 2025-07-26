import { baseApi } from "@/redux/api/baseApi";

const userProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ Add customer
    addProfile: builder.mutation({
      query: (userInfo) => ({
        url: '/customers/create-customer',
        method: 'POST',
        body: userInfo,
      }),
      invalidatesTags: ['Profile'],
    }),

    // ✅ Get customer by ID
    getSingelProfile: builder.query({
      query: (id) => `/customers/${id}`,  // ✅ corrected string template
      providesTags: ['Profile'],
    }),

    // ✅ Delete customer
    deleteProfile: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    // ✅ Update customer
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/customers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),

  }),
});

export const {
  useAddProfileMutation,
  useDeleteProfileMutation,
    useGetSingelProfileQuery,
  useUpdateProfileMutation
} = userProfileApi;
