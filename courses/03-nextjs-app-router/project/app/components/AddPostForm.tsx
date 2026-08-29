'use client'

import { useState } from 'react'
import { addPost } from '../actions'

export default function AddPostForm() {
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    const result = await addPost(formData)
    setMessage(result.message)
  }

  return (
    <form action={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Post title"
        required
      />

      <button type="submit">Add Post</button>

      {message && <p>{message}</p>}
    </form>
  )
}