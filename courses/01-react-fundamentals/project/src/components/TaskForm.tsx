import { useState } from 'react'

interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
}

interface TaskFormProps {
  onAddTask?: (task: Task) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Low')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (title.trim() === '') {
      setError('Title is required')
      return
    }

    setError('')

    onAddTask?.({
      id: Date.now(),
      title,
      description,
      priority,
      completed: false,
    })

    setTitle('')
    setDescription('')
    setPriority('Low')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {error && <p id="task-form-error">{error}</p>}

      <button type="submit">Add Task</button>
    </form>
  )
}