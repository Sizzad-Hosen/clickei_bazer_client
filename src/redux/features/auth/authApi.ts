import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/login',
        method: 'POST',
        body: userInfo,
      }),
    }),

    getMe: builder.query({
      query: () => `/auth/getMe`,
      providesTags: ['Auth'],
    }),

    changePassword: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: userInfo,
      }),
      invalidatesTags: ['Auth'],
    }),

  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useChangePasswordMutation,
} = authApi;
