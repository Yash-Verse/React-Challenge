import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi, type User, type Post } from './mockServer'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),

  tagTypes: ['User', 'Post'],

  endpoints: (builder) => ({
    // Challenge 07
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

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'User' as const,
                id,
              })),
              { type: 'User' as const, id: 'LIST' },
            ]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),

    // Challenge 08
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          const data = await mockApi.getPosts()
          return { data }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to fetch posts',
            },
          }
        }
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Post' as const,
                id,
              })),
              { type: 'Post' as const, id: 'LIST' },
            ]
          : [{ type: 'Post' as const, id: 'LIST' }],
    }),

    // Challenge 09 + Challenge 10
    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      queryFn: async (post) => {
        try {
          const data = await mockApi.createPost(post)
          return { data }
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error:
                error instanceof Error
                  ? error.message
                  : 'Failed to create post',
            },
          }
        }
      },

      // Challenge 10: Optimistic update
      async onQueryStarted(
        post,
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            'getPosts',
            undefined,
            (draft) => {
              draft.push({
                ...post,
                id: Date.now(),
              })
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },

      // Challenge 09
      // Also keeps the cached list synchronized with the server.
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetPostsQuery,
  useAddPostMutation,
} = apiSlice