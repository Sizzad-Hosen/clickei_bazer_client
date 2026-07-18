import { baseApi } from "@/redux/api/baseApi";
import type { IUser } from "@/types/user";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation<{ success: boolean; message?: string; data: { accessToken: string } }, { email: string; password: string }>({
      query: (userInfo) => ({
        url: '/auth/login',
        method: 'POST',
        body: userInfo,
      }),
    }),

    getMe: builder.query<{ data: IUser }, void>({
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

    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
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
  useLogoutMutation,
} = authApi;
