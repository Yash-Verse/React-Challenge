import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../api/apiSlice'

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>()

  const id = postId ? Number(postId) : undefined

  const {
    data: post,
    isLoading,
    isError,
  } = useGetPostByIdQuery(id as number, {
    skip: !id,
  })

  if (!id) {
    return (
      <div data-testid="post-detail-error">
        Invalid post ID.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div data-testid="post-detail-loading">
        Loading post...
      </div>
    )
  }

  if (isError) {
    return (
      <div data-testid="post-detail-error">
        Failed to load post.
      </div>
    )
  }

  if (!post) {
    return (
      <div data-testid="post-detail-error">
        Post not found.
      </div>
    )
  }

  return (
    <div data-testid="post-detail">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <p>User ID: {post.userId}</p>
    </div>
  )
}