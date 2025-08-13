import { baseApi } from "@/redux/api/baseApi";
import { ApiResponse } from "@/types/global";
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

getAllUsers: builder.query<ApiResponse<IUser>, void>({
  query: () => '/users',
  providesTags: ['User'],
  transformResponse: (response: ApiResponse<IUser>) => {
    // Just return the response as is (or add default meta)
    return {
      data: {
        data: response.data.data,  // IUser[]
        meta: response.data.meta ?? { total: 0, totalPages: 0, limit: 0, page: 1 },
      },
    };
  },
})


  }),
});

export const { useCreateUserMutation , useGetAllUsersQuery} = usersApi;