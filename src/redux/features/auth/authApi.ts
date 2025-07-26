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

  }),
});

export const { useLoginMutation , useGetMeQuery} = authApi;