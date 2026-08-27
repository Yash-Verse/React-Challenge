type Post = {
  id: number
  title: string
  body: string
}

const posts: Post[] = [
  {
    id: 1,
    title: 'First Post',
    body: 'This is the first post.',
  },
  {
    id: 2,
    title: 'Second Post',
    body: 'This is the second post.',
  },
]

export async function GET() {
  return Response.json(posts)
}