'use server'

import { revalidatePath } from 'next/cache'

type ActionResult = {
  success: boolean
  message: string
}

export async function addPost(formData: FormData): Promise<ActionResult> {
  const title = formData.get('title')

  if (typeof title !== 'string' || !title.trim()) {
    return {
      success: false,
      message: 'Title is required.',
    }
  }

  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          body: 'Created from the Next.js Server Action.',
          userId: 1,
        }),
      }
    )

    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to add post.',
      }
    }

    revalidatePath('/posts')

    return {
      success: true,
      message: 'Post added successfully.',
    }
  } catch {
    return {
      success: false,
      message: 'Unable to add post.',
    }
  }
}