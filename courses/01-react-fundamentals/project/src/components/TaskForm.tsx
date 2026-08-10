
import { useState } from 'react'

interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category: string
  tags: string[]
  dueDate?: string
}

interface TaskFormProps {
  onAddTask?: (task: Task) => void
  categories?: string[]
}

const DEFAULT_CATEGORIES = [
  'General',
  'Work',
  'Personal',
]

export default function TaskForm({
  onAddTask,
  categories = DEFAULT_CATEGORIES,
}: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] =
    useState('')
  const [priority, setPriority] =
    useState('Low')
  const [category, setCategory] =
    useState('General')
  const [tagsInput, setTagsInput] =
    useState('')
  const [dueDate, setDueDate] =
    useState('')
  const [error, setError] = useState('')

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (title.trim() === '') {
      setError('Title is required')
      return
    }

    setError('')

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '')

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description,
      priority,
      completed: false,
      category: category || 'General',
      tags,
    }

    if (dueDate) {
      newTask.dueDate = dueDate
    }

    onAddTask?.(newTask)

    setTitle('')
    setDescription('')
    setPriority('Low')
    setCategory('General')
    setTagsInput('')
    setDueDate('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="task-title">
          Title
        </label>

        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="task-description">
          Description
        </label>

        <textarea
          id="task-description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="task-priority">
          Priority
        </label>

        <select
          id="task-priority"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">
            Medium
          </option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="task-category">
          Category
        </label>

        <select
          id="task-category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="task-tags">
          Tags
        </label>

        <input
          id="task-tags"
          type="text"
          placeholder="react, frontend, work"
          value={tagsInput}
          onChange={(e) =>
            setTagsInput(e.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="task-due-date">
          Due Date
        </label>

        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />
      </div>

      {error && (
        <p id="task-form-error">
          {error}
        </p>
      )}

      <button type="submit">
        Add Task
      </button>
    </form>
  )
}

