
'use client'

import { useState } from 'react'

export default function LikeButton() {
  const [liked, setLiked] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setLiked((current) => !current)}
    >
      {liked ? '❤️ Liked' : '🤍 Like'}
    </button>
  )
}

