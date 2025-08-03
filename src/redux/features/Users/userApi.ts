import { baseApi } from "@/redux/api/baseApi";
import { IUser } from "@/types/user";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createUser: builder.mutation({

      query: (userInfo) => ({
        url: '/users/register-user',
        method: 'POST',
        body: userInfo,
      }),
    }),

 getAllUsers: builder.query<IUser[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),

  }),
});

export const { useCreateUserMutation , useGetAllUsersQuery} = usersApi;