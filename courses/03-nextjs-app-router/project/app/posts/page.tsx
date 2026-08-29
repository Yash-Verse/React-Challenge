
import { Suspense } from 'react'
import Link from 'next/link'
import PostsList from './PostsList'

export const dynamic = 'force-dynamic'

type Post = {
  id: number
  title: string
  body: string
}

type PostsPageProps = {
  searchParams: {
    q?: string
    page?: string
  }
}

async function PostsContent({ searchParams }: PostsPageProps) {
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts',
      { cache: 'no-store' }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }

    const posts: Post[] = await response.json()

    // Read search parameters
    const searchQuery = searchParams.q?.toLowerCase().trim() || ''

    const currentPage = Math.max(
      1,
      Number(searchParams.page) || 1
    )

    // Filter posts by title
    const filteredPosts = searchQuery
      ? posts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery)
        )
      : posts

    // Pagination
    const postsPerPage = 10

    const totalPages = Math.ceil(
      filteredPosts.length / postsPerPage
    )

    const startIndex = (currentPage - 1) * postsPerPage

    const paginatedPosts = filteredPosts.slice(
      startIndex,
      startIndex + postsPerPage
    )

    return (
      <main>
        <h1>Posts</h1>

        {/* Search */}
        <form method="GET">
          <input
            type="text"
            name="q"
            placeholder="Search posts..."
            defaultValue={searchParams.q || ''}
          />

          <button type="submit">
            Search
          </button>
        </form>

        {/* Search information */}
        {searchQuery && (
          <p>
            Search results for:{' '}
            <strong>{searchQuery}</strong>
          </p>
        )}

        {/* Filtered and paginated posts */}
        {paginatedPosts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <ul>
            {paginatedPosts.map((post) => (
              <li key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav>
            {currentPage > 1 && (
              <Link
                href={`/posts?q=${encodeURIComponent(
                  searchQuery
                )}&page=${currentPage - 1}`}
              >
                Previous
              </Link>
            )}

            <span>
              {' '}
              Page {currentPage} of {totalPages}{' '}
            </span>

            {currentPage < totalPages && (
              <Link
                href={`/posts?q=${encodeURIComponent(
                  searchQuery
                )}&page=${currentPage + 1}`}
              >
                Next
              </Link>
            )}
          </nav>
        )}

        {/* RTK Query */}
        <PostsList />
      </main>
    )
  } catch {
    return (
      <main>
        <h1>Posts</h1>
        <p>Unable to load posts.</p>

        <PostsList />
      </main>
    )
  }
}

export default function PostsPage({
  searchParams,
}: PostsPageProps) {
  return (
    <Suspense fallback={<p>Loading posts...</p>}>
      <PostsContent searchParams={searchParams} />
    </Suspense>
  )
}

