import { baseApi } from "@/redux/api/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (userInfo) => ({
        url: '/categories/create-category',
        method: 'POST',
        body: userInfo,
      }),
    }),
    
    getAllCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),

updateCategory: builder.mutation({
  query: ({ id, ...data }) => ({
    url: `/categories/${id}`,
    method: 'PUT',
    body: data,
  }),
  invalidatesTags: ['Categories'],
}),




  }),
});

export const { useAddCategoryMutation, useDeleteCategoryMutation, useGetAllCategoriesQuery , useUpdateCategoryMutation } = categoryApi;