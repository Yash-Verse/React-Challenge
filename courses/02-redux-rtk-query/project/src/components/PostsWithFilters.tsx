
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  setFilterUserId,
  setSortBy,
  type SortBy,
} from '../store/slices/filtersSlice'
import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsWithFilters() {
  const { data: posts = [], isLoading, isError } =
    useGetPostsQuery()

  const { sortBy, filterUserId } = useAppSelector(
    (state) => state.filters
  )

  const dispatch = useAppDispatch()

  const filteredPosts = posts
    .filter((post) =>
      filterUserId === null
        ? true
        : post.userId === filterUserId
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id - a.id
      }

      if (sortBy === 'oldest') {
        return a.id - b.id
      }

      return a.title.localeCompare(b.title)
    })

  if (isLoading) {
    return (
      <div data-testid="posts-with-filters">
        Loading posts...
      </div>
    )
  }

  if (isError) {
    return (
      <div data-testid="posts-with-filters">
        Failed to load posts.
      </div>
    )
  }

  return (
    <div data-testid="posts-with-filters">
      <div data-testid="filter-controls">
        <label htmlFor="sort-by">Sort by: </label>

        <select
          id="sort-by"
          value={sortBy}
          onChange={(event) =>
            dispatch(
              setSortBy(event.target.value as SortBy)
            )
          }
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title</option>
        </select>

        <label htmlFor="user-filter">
          Filter by user:
        </label>

        <select
          id="user-filter"
          value={filterUserId ?? ''}
          onChange={(event) => {
            const value = event.target.value

            dispatch(
              setFilterUserId(
                value === '' ? null : Number(value)
              )
            )
          }}
        >
          <option value="">All users</option>
          <option value="1">User 1</option>
          <option value="2">User 2</option>
        </select>
      </div>

      <div>
        {filteredPosts.map((post) => (
          <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <span>User {post.userId}</span>
          </article>
        ))}
      </div>
    </div>
  )
}
