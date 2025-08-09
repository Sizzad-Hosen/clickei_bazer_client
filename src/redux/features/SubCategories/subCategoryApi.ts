import { baseApi } from "@/redux/api/baseApi";

const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSubCategory: builder.mutation({
      query: (userInfo) => ({
        url: '/subCategories/create-subCategory',
        method: 'POST',
        body: userInfo,
      }),
    }),
    
    getAllSubCategories: builder.query({
      query: () => '/subCategories',
      providesTags: ['SubCategories'],
    }),
    
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/subCategories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubCategories'],
    }),

updateSubCategory: builder.mutation({
  query: ({ id, ...data }) => ({
    url: `/subCategories/${id}`,
    method: 'PATCH',
    body: data,
  }),
  invalidatesTags: ['SubCategories'],
}),

  }),
});

export const { useAddSubCategoryMutation, useDeleteSubCategoryMutation, useGetAllSubCategoriesQuery, useUpdateSubCategoryMutation } = subCategoryApi;