import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi, type User } from './mockServer'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getUsers()
          return { data }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch users',
            },
          }
        }
      },
      providesTags: ['Users'],
    }),
  }),
})

export const { useGetUsersQuery } = apiSlice