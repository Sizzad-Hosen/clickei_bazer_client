import { baseApi } from "@/redux/api/baseApi";


const serviceApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (userInfo) => ({
        url: '/services/create-service',
        method: 'POST',
        body: userInfo,
      }),
    }),
  }),
});

export const {useAddServiceMutation} = serviceApi;