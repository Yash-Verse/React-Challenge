import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsList() {
  const { data, isLoading, isError } = useGetPostsQuery()

  if (isLoading) {
    return <div data-testid="posts-loading">Loading...</div>
  }

  if (isError) {
    return (
      <div data-testid="posts-error">
        Failed to load posts
      </div>
    )
  }

  return (
    <div data-testid="posts-list">
      {data?.map((post) => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  )
}