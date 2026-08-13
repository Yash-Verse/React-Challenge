import React, {
  useEffect,
  useState,
} from 'react'
import { Link } from 'react-router-dom'

interface TaskCardProps {
  title: string
  description: string
  priority: string
  category?: string
  tags?: string[]
  dueDate?: string | number
  completed?: boolean

  onToggle?: (
    id: string | number
  ) => void

  onDelete?: (
    id: string | number
  ) => void

  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
      category: string
      tags: string[]
      dueDate?: string | number
    }
  ) => void

  taskId?: string | number

  editingId?: string | number | null

  setEditingId?: (
    id: string | number | null
  ) => void

  linkToTaskDetail?: boolean
}

function TaskCard({
  title,
  description,
  priority,
  category = 'General',
  tags = [],
  dueDate,
  completed = false,
  onToggle,
  onDelete,
  onUpdateTask,
  taskId,
  editingId,
  setEditingId,
  linkToTaskDetail = false,
}: TaskCardProps) {
  const isEditing = editingId === taskId

  const [editTitle, setEditTitle] =
    useState(title)

  const [editDescription, setEditDescription] =
    useState(description)

  const [editPriority, setEditPriority] =
    useState(priority)

  const [editCategory, setEditCategory] =
    useState(category)

  const [editTags, setEditTags] =
    useState(tags.join(', '))

  const [editDueDate, setEditDueDate] =
    useState(
      dueDate
        ? new Date(dueDate)
            .toISOString()
            .slice(0, 10)
        : ''
    )

  useEffect(() => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditCategory(category)
    setEditTags(tags.join(', '))
    setEditDueDate(
      dueDate
        ? new Date(dueDate)
            .toISOString()
            .slice(0, 10)
        : ''
    )
  }, [
    title,
    description,
    priority,
    category,
    tags,
    dueDate,
  ])

  const parsedTags = editTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  const saveTask = () => {
    if (!editTitle.trim()) {
      return
    }

    onUpdateTask?.(taskId ?? '', {
      title: editTitle.trim(),
      description: editDescription,
      priority: editPriority,
      category: editCategory,
      tags: parsedTags,
      dueDate:
        editDueDate || undefined,
    })

    setEditingId?.(null)
  }

  const cancelEdit = () => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditCategory(category)
    setEditTags(tags.join(', '))
    setEditDueDate(
      dueDate
        ? new Date(dueDate)
            .toISOString()
            .slice(0, 10)
        : ''
    )

    setEditingId?.(null)
  }

  const getDueStatus = () => {
    if (!dueDate || completed) {
      return null
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)

    const difference = Math.ceil(
      (due.getTime() -
        today.getTime()) /
        (1000 * 60 * 60 * 24)
    )

    if (difference < 0) {
      return 'Overdue'
    }

    if (difference === 0) {
      return 'Due Today'
    }

    if (difference <= 3) {
      return 'Due Soon'
    }

    return null
  }

  const dueStatus = getDueStatus()

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
        backgroundColor: completed
          ? '#e6ffe6'
          : dueStatus === 'Overdue'
          ? '#ffe6e6'
          : '',
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

          <select
            value={editCategory}
            onChange={(e) =>
              setEditCategory(
                e.target.value
              )
            }
          >
            <option value="General">
              General
            </option>
            <option value="Work">
              Work
            </option>
            <option value="Personal">
              Personal
            </option>
          </select>

          <input
            value={editTags}
            onChange={(e) =>
              setEditTags(e.target.value)
            }
            placeholder="react, frontend, urgent"
          />

          <input
            type="date"
            value={editDueDate}
            onChange={(e) =>
              setEditDueDate(
                e.target.value
              )
            }
          />

          <button
            type="button"
            onClick={saveTask}
          >
            Save
          </button>

          <button
            type="button"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          {linkToTaskDetail &&
          taskId !== undefined ? (
            <h2
              style={{
                textDecoration:
                  completed
                    ? 'line-through'
                    : 'none',
              }}
            >
              <Link
                to={`/challenge/21-react-router/task/${taskId}`}
              >
                {title}
              </Link>
            </h2>
          ) : (
            <h2
              style={{
                textDecoration:
                  completed
                    ? 'line-through'
                    : 'none',
              }}
            >
              {title}
            </h2>
          )}

          <p>{description}</p>

          <p>
            Priority: {priority}
          </p>

          <p id="task-category">
            {category}
          </p>

          <div id="task-tags">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                data-tag={tag}
              >
                {tag}
              </span>
            ))}
          </div>

          {dueDate && (
            <div id="task-due-date">
              Due:{' '}
              {new Date(
                dueDate
              ).toLocaleDateString()}
            </div>
          )}

          {dueStatus && (
            <span
              className={`status-${dueStatus
                .toLowerCase()
                .replace(' ', '-')}`}
            >
              {dueStatus}
            </span>
          )}

          {onUpdateTask && (
            <button
              type="button"
              onClick={() =>
                setEditingId?.(
                  taskId ?? null
                )
              }
            >
              Edit
            </button>
          )}
        </>
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
    </article>
  )
}

export default React.memo(TaskCard)