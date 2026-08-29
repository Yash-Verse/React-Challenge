import { notFound } from 'next/navigation'

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
      notFound()
    }

    const post: Post = await response.json()

    if (!post) {
      notFound()
    }

    return (
      <main>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </main>
    )
  } catch {
    notFound()
  }
}