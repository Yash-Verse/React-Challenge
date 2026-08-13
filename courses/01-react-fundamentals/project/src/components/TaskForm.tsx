import { useState } from 'react'
import Button from './Button'
import FormInput from './FormInput'

interface TaskFormProps {
  onAddTask?: (task: Record<string, unknown>) => void
}

export default function TaskForm({
  onAddTask,
}: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Low')
  const [category, setCategory] = useState('General')
  const [tags, setTags] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setError('')

    const parsedTags = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    onAddTask?.({
      id: Date.now(),
      title: title.trim(),
      description,
      priority,
      completed: false,
      category,
      tags: parsedTags,
      ...(dueDate ? { dueDate } : {}),
    })

    setTitle('')
    setDescription('')
    setPriority('Low')
    setCategory('General')
    setTags('')
    setDueDate('')
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p id="task-form-error">
          {error}
        </p>
      )}

      <FormInput
        label="Title"
        id="task-title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <FormInput
        label="Description"
        id="task-description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        multiline
      />

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
          <option value="Medium">Medium</option>
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
          <option value="General">
            General
          </option>
          <option value="Work">Work</option>
          <option value="Personal">
            Personal
          </option>
        </select>
      </div>

      <FormInput
        label="Tags"
        id="task-tags-input"
        value={tags}
        onChange={(e) =>
          setTags(e.target.value)
        }
        placeholder="react, frontend, urgent"
      />

      <FormInput
        label="Due Date"
        id="task-due-date-input"
        type="date"
        value={dueDate}
        onChange={(e) =>
          setDueDate(e.target.value)
        }
      />

      <Button type="submit" variant="primary">
        Add Task
      </Button>
    </form>
  )
}