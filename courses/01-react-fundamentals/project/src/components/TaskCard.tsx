import { useEffect, useState } from 'react'

interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  taskId?: string | number

  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
    }
  ) => void

  editingId?: string | number | null
  setEditingId?: (
    id: string | number | null
  ) => void
}

export default function TaskCard({
  title,
  description,
  priority,
  completed = false,
  onToggle,
  onDelete,
  taskId,
  onUpdateTask,
  editingId,
  setEditingId,
}: TaskCardProps) {
  const isEditing =
  editingId !== null &&
  editingId !== undefined &&
  editingId === taskId
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] =
    useState(description)
  const [editPriority, setEditPriority] =
    useState(priority)

  useEffect(() => {
    if (isEditing) {
      setEditTitle(title)
      setEditDescription(description)
      setEditPriority(priority)
    }
  }, [
    isEditing,
    title,
    description,
    priority,
  ])

  function handleSave() {
    if (!editTitle.trim()) return

    onUpdateTask?.(taskId ?? '', {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    })

    setEditingId?.(null)
  }

  function handleCancel() {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditingId?.(null)
  }

  return (
    <article
      id="task-card"
      data-completed={completed}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: completed
          ? '#e6ffe6'
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
            <option value="High">
              High
            </option>
            <option value="Medium">
              Medium
            </option>
            <option value="Low">
              Low
            </option>
          </select>

          <button
            type="button"
            onClick={handleSave}
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
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

          <p>{priority}</p>

          {setEditingId && (
            <button
              type="button"
              onClick={() =>
                setEditingId(
                  taskId ?? null
                )
              }
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure?'
                  )
                ) {
                  onDelete(taskId ?? '')
                }
              }}
            >
              Delete
            </button>
          )}
        </>
      )}
    </article>
  )
}