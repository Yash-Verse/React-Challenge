import { useEffect, useState } from 'react'

interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean

  // Challenge 12
  category?: string
  tags?: string[]

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
  category = 'General',
  tags = [],
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

  useEffect(() => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
  }, [title, description, priority])

  function handleSave() {
    if (
      editTitle.trim() === '' ||
      !onUpdateTask ||
      taskId === undefined
    ) {
      return
    }

    onUpdateTask(taskId, {
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
              setEditTitle(
                e.target.value
              )
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

          <p>
            
           {priority.startsWith('Priority:')
           ? priority
           : `Priority: ${priority}`}

          </p>

          <p id="task-category">
            Category: {category}
          </p>

          <div id="task-tags">
            {(tags ?? []).map((tag) => (
              <span
                key={tag}
                data-tag
                style={{
                  display:
                    'inline-block',
                  marginRight: '6px',
                  padding:
                    '2px 8px',
                  borderRadius:
                    '12px',
                  border:
                    '1px solid #ccc',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {onUpdateTask &&
            setEditingId && (
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
                  onDelete(
                    taskId ?? ''
                  )
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