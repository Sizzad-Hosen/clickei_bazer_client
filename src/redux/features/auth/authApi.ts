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

    forgotPassword: builder.mutation({
      query: (body: { email: string }) => ({
        url: '/auth/forget-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, newPassword }: { token: string; newPassword: string }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { newPassword },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
