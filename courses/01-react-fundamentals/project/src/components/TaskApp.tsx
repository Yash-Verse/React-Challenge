import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import FilterBar from './FilterBar'
import TaskForm from './TaskForm'
import TaskList, { type Task } from './TaskList'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

const DEFAULT_TASKS: Task[] = [
  {
    id: 1,
    title: 'First Task',
    description: 'This is the first task.',
    priority: 'Priority: High',
    completed: false,
  },
  {
    id: 2,
    title: 'Second Task',
    description: 'This is the second task.',
    priority: 'Priority: Medium',
    completed: false,
  },
  {
    id: 3,
    title: 'Third Task',
    description: 'This is the third task.',
    priority: 'Priority: Low',
    completed: false,
  },
  {
    id: 4,
    title: 'Fourth Task',
    description: 'This is the fourth task.',
    priority: 'Priority: High',
    completed: false,
  },
  {
    id: 5,
    title: 'Fifth Task',
    description: 'This is the fifth task.',
    priority: 'Priority: Medium',
    completed: false,
  },
]

const priorityOrder: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
}



export default function TaskApp({
  tasks,
  setTasks,
  showForm,
  showFilterBar,
  countFormat,
}: TaskAppProps) {
  const [localTasks, setLocalTasks] =
    useState<Task[]>(DEFAULT_TASKS)

  const [filter, setFilter] = useState<
    'all' | 'active' | 'completed'
  >('all')

  const [sort, setSort] = useState<
    'recent' | 'high' | 'low' | 'alpha'
  >('recent')

  const [editingId, setEditingId] = useState<
  string | number | null
  >(null)

  const taskList = tasks ?? localTasks

  const filteredTasks =
    filter === 'active'
      ? taskList.filter((task) => !task.completed)
      : filter === 'completed'
        ? taskList.filter((task) => task.completed)
        : taskList

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => {
      switch (sort) {
        case 'high':
          return (
            priorityOrder[
              b.priority.replace(
                'Priority: ',
                ''
              )
            ] -
            priorityOrder[
              a.priority.replace(
                'Priority: ',
                ''
              )
            ]
          )

        case 'low':
          return (
            priorityOrder[
              a.priority.replace(
                'Priority: ',
                ''
              )
            ] -
            priorityOrder[
              b.priority.replace(
                'Priority: ',
                ''
              )
            ]
          )

        case 'alpha':
          return a.title.localeCompare(
            b.title,
            undefined,
            {
              sensitivity: 'base',
            }
          )

        case 'recent':
        default:
          return Number(a.id) - Number(b.id)
      }
    }
  )

  const completedCount = taskList.filter(
    (task) => task.completed
  ).length

  const countText = showFilterBar
    ? `Showing ${sortedTasks.length} of ${taskList.length} tasks`
    : countFormat === 'completed'
      ? `${completedCount} of ${taskList.length} completed`
      : `${taskList.length} tasks`

  function handleAddTask(task: Task) {
    if (setTasks) {
      setTasks((prev) => [...prev, task])
    } else {
      setLocalTasks((prev) => [...prev, task])
    }
  }

  function handleToggle(id: string | number) {
    if (setTasks) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
              }
            : task
        )
      )
    } else {
      setLocalTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
              }
            : task
        )
      )
    }
  }

  function handleDelete(id: string | number) {
    if (setTasks) {
      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      )
    } else {
      setLocalTasks((prev) =>
        prev.filter((task) => task.id !== id)
      )
    }
  }

  function handleUpdateTask(
  id: string | number,
  updates: {
    title: string
    description: string
    priority: string
  }
 ) {
  if (setTasks) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
            }
          : task
      )
    )
  } else {
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
            }
          : task
      )
    )
  }
 }

    return (
    <>
      {showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
        />
      )}

      <TaskList
        tasks={sortedTasks}
        countText={countText}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onUpdateTask={handleUpdateTask}
        editingId={editingId}
        setEditingId={setEditingId}
      />
    </>
  )
}