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
  forgetPassword: builder.mutation({
      query: (userInfo) => ({
        
        url: '/auth/forget-password',
        method: 'POST',
        body: userInfo,
      }),
      invalidatesTags: ['Auth'],
    }),
    
resetPassword: builder.mutation({
  query: ({ token, ...userInfo }) => ({
    url: '/auth/reset-password',
    method: 'POST',
    body: userInfo, // email, oldPassword, newPassword
    headers: {
      Authorization: `Bearer ${token}`, // ✅ send token here
    },
  }),
  invalidatesTags: ['Auth'],
}),



  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation
} = authApi;
