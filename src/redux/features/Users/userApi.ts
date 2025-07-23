import { baseApi } from "@/redux/api/baseApi";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userInfo) => ({
        url: '/users/register-user',
        method: 'POST',
        body: userInfo,
      }),
    }),
  }),
});

export const { useCreateUserMutation } = usersApi;