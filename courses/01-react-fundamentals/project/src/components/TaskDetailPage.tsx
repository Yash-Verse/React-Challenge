import { useNavigate, useParams } from 'react-router-dom'
import type { Task } from './TaskList'

const STORAGE_KEY = 'task-app-tasks'

const FALLBACK_TASKS: Task[] = [
  {
    id: 1,
    title: 'First Task',
    description: 'Description one',
    priority: 'High',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 2,
    title: 'Second Task',
    description: 'Description two',
    priority: 'Medium',
    completed: true,
    category: 'General',
    tags: [],
  },
]

function getTasks(): Task[] {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return FALLBACK_TASKS
    }

    const parsed = JSON.parse(stored)

    if (!Array.isArray(parsed)) {
      return FALLBACK_TASKS
    }

    return parsed
  } catch {
    return FALLBACK_TASKS
  }
}

export default function TaskDetailPage() {
  const { id } = useParams<{
    id: string
  }>()

  const navigate = useNavigate()

  const tasks = getTasks()

  const task = tasks.find(
    (item) => String(item.id) === String(id)
  )

  if (!task) {
    return (
      <main id="task-detail-page">
        <h1>Task not found</h1>

        <button
          id="task-detail-back"
          type="button"
          onClick={() =>
            navigate(
              '/challenge/21-react-router'
            )
          }
        >
          Back to list
        </button>
      </main>
    )
  }

  return (
    <main id="task-detail-page">
      <button
        id="task-detail-back"
        type="button"
        onClick={() =>
          navigate(
            '/challenge/21-react-router'
          )
        }
      >
        Back to list
      </button>

      <h1>{task.title}</h1>

      <p>{task.description}</p>

      <p>
        Priority: {task.priority}
      </p>

      <p>
        Category: {task.category}
      </p>

      <p>
        Status:{' '}
        {task.completed
          ? 'Completed'
          : 'Active'}
      </p>

      {task.tags.length > 0 && (
        <div>
          <strong>Tags:</strong>{' '}
          {task.tags.join(', ')}
        </div>
      )}

      {task.dueDate && (
        <p>
          Due:{' '}
          {new Date(
            task.dueDate
          ).toLocaleDateString()}
        </p>
      )}
    </main>
  )
}