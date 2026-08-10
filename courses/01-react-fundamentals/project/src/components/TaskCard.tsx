import { useEffect, useState } from 'react'
import Button from './Button'
import Badge from './Badge'
import StatusIndicator from './StatusIndicator'

interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  category?: string
  tags?: string[]
  dueDate?: string

  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void

  taskId?: string | number

  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
      dueDate?: string
    }
  ) => void

  editingId?: string | number | null

  setEditingId?: (
    id: string | number | null
  ) => void
}

function getDateOnly(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
}

function getDueDateStatus(
  dueDate?: string,
  completed = false
) {
  if (!dueDate || completed) {
    return null
  }

  const today = getDateOnly(new Date())

  const due = getDateOnly(
    new Date(`${dueDate}T00:00:00`)
  )

  const difference =
    due.getTime() - today.getTime()

  const daysUntil =
    difference /
    (1000 * 60 * 60 * 24)

  if (daysUntil < 0) {
    return 'Overdue'
  }

  if (daysUntil === 0) {
    return 'Due Today'
  }

  if (daysUntil <= 3) {
    return 'Due Soon'
  }

  return null
}

export default function TaskCard({
  title,
  description,
  priority,
  completed = false,
  category = 'General',
  tags = [],
  dueDate,
  onToggle,
  onDelete,
  taskId,
  onUpdateTask,
  editingId,
  setEditingId,
}: TaskCardProps) {
  const isEditing =
    taskId !== undefined &&
    editingId === taskId

  const [editTitle, setEditTitle] =
    useState(title)

  const [
    editDescription,
    setEditDescription,
  ] = useState(description)

  const [editPriority, setEditPriority] =
    useState(priority)

  const [editDueDate, setEditDueDate] =
    useState(dueDate ?? '')

  useEffect(() => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditDueDate(dueDate ?? '')
  }, [
    title,
    description,
    priority,
    dueDate,
  ])

  const dueStatus = getDueDateStatus(
    dueDate,
    completed
  )

  function handleSave() {
    if (
      editTitle.trim() === '' ||
      !onUpdateTask ||
      taskId === undefined
    ) {
      return
    }

    onUpdateTask(taskId, {
      title: editTitle.trim(),
      description: editDescription,
      priority: editPriority,
      dueDate:
        editDueDate.trim() === ''
          ? undefined
          : editDueDate,
    })

    setEditingId?.(null)
  }

  function handleCancel() {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditDueDate(dueDate ?? '')
    setEditingId?.(null)
  }

  return (
    <article
      id="task-card"
      data-completed={completed}
      data-overdue={
        dueStatus === 'Overdue'
          ? 'true'
          : 'false'
      }
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: completed
          ? '#e6ffe6'
          : dueStatus === 'Overdue'
          ? '#ffe6e6'
          : '#fff',
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() =>
            onToggle(taskId ?? '')
          }
        />
      )}

      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) =>
              setEditTitle(e.target.value)
            }
          />

          <textarea
            value={editDescription}
            onChange={(e) =>
              setEditDescription(
                e.target.value
              )
            }
          />

          <select
            value={editPriority}
            onChange={(e) =>
              setEditPriority(
                e.target.value
              )
            }
          >
            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>
          </select>

          <input
            id="task-due-date"
            type="date"
            value={editDueDate}
            onChange={(e) =>
              setEditDueDate(
                e.target.value
              )
            }
          />

          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
          >
            Save
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <h2
            style={{
              textDecoration: completed
                ? 'line-through'
                : 'none',
            }}
          >
            {title}
          </h2>

          <p
            style={{
              textDecoration: completed
                ? 'line-through'
                : 'none',
            }}
          >
            {description}
          </p>

          <Badge variant="priority">
            {priority.startsWith('Priority:')
              ? priority
              : `Priority: ${priority}`}
          </Badge>

          <Badge variant="category">
            Category: {category}
          </Badge>

          <div id="task-tags">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="tag"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {dueDate && (
            <div
              id="task-due-date"
              data-overdue={
                dueStatus === 'Overdue'
                  ? 'true'
                  : 'false'
              }
              style={{
                color:
                  dueStatus === 'Overdue'
                    ? 'red'
                    : 'inherit',
                fontWeight:
                  dueStatus
                    ? 'bold'
                    : 'normal',
              }}
            >
              Due Date:{' '}
              {new Date(
                `${dueDate}T00:00:00`
              ).toLocaleDateString()}

              {dueStatus && (
                <StatusIndicator
                  status={dueStatus}
                />
              )}
            </div>
          )}

          {completed && (
            <StatusIndicator
              status="Completed"
            />
          )}

          {onUpdateTask &&
            setEditingId && (
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setEditingId(
                    taskId ?? null
                  )
                }
              >
                Edit
              </Button>
            )}

          {onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure?'
                  )
                ) {
                  onDelete(
                    taskId ?? ''
                  )
                }
              }}
            >
              Delete
            </Button>
          )}
        </>
      )}
    </article>
  )
}