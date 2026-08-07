import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import FilterBar from './FilterBar'
import TaskForm from './TaskForm'
import TaskList, { type Task } from './TaskList'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: {
    type: string
    payload?: unknown
  }) => void
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
    category: 'General',
    tags: [],
  },
  {
    id: 2,
    title: 'Second Task',
    description: 'This is the second task.',
    priority: 'Priority: Medium',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 3,
    title: 'Third Task',
    description: 'This is the third task.',
    priority: 'Priority: Low',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 4,
    title: 'Fourth Task',
    description: 'This is the fourth task.',
    priority: 'Priority: High',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 5,
    title: 'Fifth Task',
    description: 'This is the fifth task.',
    priority: 'Priority: Medium',
    completed: false,
    category: 'General',
    tags: [],
  },
]

const priorityOrder: Record<
  string,
  number
> = {
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
    useState(DEFAULT_TASKS)

  const [filter, setFilter] =
    useState<
      'all' | 'active' | 'completed'
    >('all')

  const [sort, setSort] =
    useState<
      'recent' | 'high' | 'low' | 'alpha'
    >('recent')

  const [category, setCategory] =
    useState('All')

  const [search, setSearch] =
    useState('')

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState('')

  const [editingId, setEditingId] =
    useState<
      string | number | null
    >(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timeout)
  }, [search])

  const taskList =
    tasks ?? localTasks

  const categories = [
    ...new Set(
      taskList.map(
        (task) =>
          task.category ??
          'General'
      )
    ),
  ]

  const filteredTasks =
    filter === 'active'
      ? taskList.filter(
          (task) => !task.completed
        )
      : filter === 'completed'
      ? taskList.filter(
          (task) => task.completed
        )
      : taskList

  const categoryFilteredTasks =
    category === 'All'
      ? filteredTasks
      : filteredTasks.filter(
          (task) =>
            (task.category ??
              'General') ===
            category
        )

  const searchedTasks =
    categoryFilteredTasks.filter(
      (task) =>
        task.title
          .toLowerCase()
          .includes(
            debouncedSearch.toLowerCase()
          ) ||
        task.description
          .toLowerCase()
          .includes(
            debouncedSearch.toLowerCase()
          )
    )

  const sortedTasks = [
    ...searchedTasks,
  ].sort((a, b) => {
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

      default:
        return (
          Number(a.id) -
          Number(b.id)
        )
    }
  })

  const completedCount =
    taskList.filter(
      (task) => task.completed
    ).length

  const countText =
    showFilterBar
      ? `Showing ${sortedTasks.length} of ${taskList.length} tasks`
      : countFormat ===
        'completed'
      ? `${completedCount} of ${taskList.length} completed`
      : `${taskList.length} tasks`
  function handleAddTask(task: Task) {
    if (setTasks) {
      setTasks((prev) => [...prev, task])
    } else {
      setLocalTasks((prev) => [
        ...prev,
        task,
      ])
    }
  }

  function handleToggle(
    id: string | number
  ) {
    if (setTasks) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed:
                  !task.completed,
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
                completed:
                  !task.completed,
              }
            : task
        )
      )
    }
  }

  function handleDelete(
    id: string | number
  ) {
    if (setTasks) {
      setTasks((prev) =>
        prev.filter(
          (task) => task.id !== id
        )
      )
    } else {
      setLocalTasks((prev) =>
        prev.filter(
          (task) => task.id !== id
        )
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

  function handleClearSearch() {
    setSearch('')
  }

  return (
    <>
      {showForm && (
        <TaskForm
          onAddTask={
            handleAddTask
          }
        />
      )}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={
            setFilter
          }
          sort={sort}
          onSortChange={
            setSort
          }
          search={search}
          onSearchChange={
            setSearch
          }
          onClearSearch={
            handleClearSearch
          }
          searching={
            search !==
            debouncedSearch
          }
          category={category}
          categories={categories}
          onCategoryChange={
            setCategory
          }
        />
      )}

      <TaskList
        tasks={sortedTasks}
        countText={countText}
        onToggle={
          handleToggle
        }
        onDelete={
          handleDelete
        }
        onUpdateTask={
          handleUpdateTask
        }
        editingId={
          editingId
        }
        setEditingId={
          setEditingId
        }
      />
    </>
  )
}      