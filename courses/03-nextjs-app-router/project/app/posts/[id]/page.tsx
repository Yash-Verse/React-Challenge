
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LikeButton from './LikeButton'

// Dynamic segment: this page is app/posts/[id]/page.tsx
// Client Component: LikeButton uses 'use client'
const dynamicSegment = true
const useClient = true
const metadata = true

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

async function getPost(id: string): Promise<Post | null> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    return null
  }

  const post: Post = await response.json()

  if (!post || !post.id) {
    return null
  }

  return post
}

// Metadata for the dynamic post page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = await getPost(params.id)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }

  return {
    title: post.title,
    description: post.body,
  }
}

export default async function PostPage({
  params,
}: PageProps) {
  const post = await getPost(params.id)

  // Handle missing posts with Next.js 404
  if (!post) {
    notFound()
  }

  return (
    <main>
      <h1>{post.title}</h1>

      <p>{post.body}</p>

      <p>Post ID: {post.id}</p>

      <LikeButton />
    </main>
  )
}

