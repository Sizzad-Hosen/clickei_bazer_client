import { createApi, fetchBaseQuery, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlices";
import { jwtDecode } from "jwt-decode";
import type { TUser } from "../features/auth/authSlices";

const base_url = process.env.NEXT_PUBLIC_API_URL;

// Base fetch query with token header

const baseQuery = fetchBaseQuery({

  // baseUrl: 'http://localhost:8080/api/v1',
  
  baseUrl: `${base_url}`,

  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token && !headers.has('authorization')) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Define type for the arguments of baseQueryWithRefreshToken
type BaseQueryArgs = string | FetchArgs;
let refreshPromise: Promise<string | null> | null = null;

// Define a BaseQueryFn type with expected inputs and outputs
const baseQueryWithRefreshToken: BaseQueryFn<
  BaseQueryArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Make the initial request
  let result = await baseQuery(args, api, extraOptions);

  // If 401 Unauthorized, try refreshing token
  const url = typeof args === 'string' ? args : args.url;
  const mayRefresh = !url.includes('/auth/refresh-token') && !url.includes('/auth/login');

  if (result.error?.status === 401 && mayRefresh) {
    refreshPromise ??= (async () => {
      const refreshResult = await baseQuery(
        { url: '/auth/refresh-token', method: 'POST' },
        api,
        extraOptions
      );
      const refreshData = refreshResult.data as { data?: { accessToken?: string } } | undefined;
      return refreshData?.data?.accessToken ?? null;
    })().finally(() => {
      refreshPromise = null;
    });

    const accessToken = await refreshPromise;
    if (accessToken) {
      try {
        api.dispatch(setUser({ user: jwtDecode<TUser>(accessToken), token: accessToken }));
        result = await baseQuery(args, api, extraOptions);
      } catch {
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
