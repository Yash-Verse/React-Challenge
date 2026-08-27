type Post = {
  id: number
  title: string
  body: string
}

type PageProps = {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PageProps) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${params.id}`
    )

    if (!response.ok) {
      throw new Error('Post not found')
    }

    const post: Post = await response.json()

    return (
      <main>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </main>
    )
  } catch {
    return (
      <main>
        <h1>Post Not Found</h1>
        <p>Unable to load post {params.id}.</p>
      </main>
    )
  }
}