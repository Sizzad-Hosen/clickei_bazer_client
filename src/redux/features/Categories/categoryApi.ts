import { baseApi } from "@/redux/api/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (userInfo) => ({
        url: '/categories/create-category',
        method: 'POST',
        body: userInfo,
      }),
    }),
    getAllServices: builder.query({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),

updateService: builder.mutation({
  query: ({ id, ...data }) => ({
    url: `/categories/${id}`,
    method: 'PUT',
    body: data,
  }),
  invalidatesTags: ['Categories'],
}),




  }),
});

export const { useAddServiceMutation ,useGetAllServicesQuery , useDeleteServiceMutation , useUpdateServiceMutation} = categoryApi;