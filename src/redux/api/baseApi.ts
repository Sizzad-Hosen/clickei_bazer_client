import { createApi, fetchBaseQuery, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlices";

const base_url = process.env.NEXT_PUBLIC_API_URL;

// Base fetch query with token header

const baseQuery = fetchBaseQuery({

  // baseUrl: 'http://localhost:8080/api/v1',
  
  baseUrl: `${base_url}`,

  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Define type for the arguments of baseQueryWithRefreshToken
type BaseQueryArgs = string | FetchArgs;

// Define a BaseQueryFn type with expected inputs and outputs
const baseQueryWithRefreshToken: BaseQueryFn<
  BaseQueryArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Make the initial request
  let result = await baseQuery(args, api, extraOptions);

  // If 401 Unauthorized, try refreshing token
  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Extract the accessToken safely
      const refreshData = refreshResult.data as { data?: { accessToken: string } };
      const accessToken = refreshData.data?.accessToken;

      if (accessToken) {
        const user = (api.getState() as RootState).auth.user;

        if (user) {
          // Update user and token in store
          api.dispatch(
            setUser({
              user,
              token: accessToken,
            })
          );

          // Retry the original query with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    'Services',
    'Categories',
    'SubCategories',
    'Products',
    'Orders',
    'Carts',
    'Profile',
    'Auth',
    'Wishlist',
    'User',
    'CustomOrder',
    'CustomProducts'
  ],
  endpoints: () => ({}),
});
