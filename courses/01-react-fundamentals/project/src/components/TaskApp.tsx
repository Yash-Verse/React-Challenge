import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
} from 'react'

import FilterBar, {
  type FilterType,
  type SortType,
} from './FilterBar'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import type { TaskAction } from '../reducers/taskReducer'
import StatsPanel from './StatsPanel'
import ErrorBoundary from './ErrorBoundary'

import type { Task } from '../reducers/taskReducer'

interface TaskAppProps {
  tasks?: Task[]
  dispatch?: Dispatch<TaskAction>
  showForm?: boolean
  showFilterBar?: boolean
  showStatsPanel?: boolean
  linkToTaskDetail?: boolean
}

export default function TaskApp({
  tasks = [],
  dispatch,
  showForm = true,
  showFilterBar = true,
  showStatsPanel = true,
  linkToTaskDetail = false,
}: TaskAppProps) {
  const [filter, setFilter] =
    useState<FilterType>('all')

  const [categoryFilter, setCategoryFilter] =
    useState('all')

  const [sortOrder, setSortOrder] =
    useState<SortType>('recent')

  const [editingId, setEditingId] =
    useState<string | number | null>(null)

  const [search, setSearch] = useState('')

  const [debouncedSearch, setDebouncedSearch] =
    useState('')

  const searchInputRef =
    useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => {
      window.clearTimeout(timer)
    }
  }, [search])

  const normalizedTasks = useMemo<Task[]>(
    () =>
      tasks.map((task) => ({
        ...task,
        category: task.category || 'General',
        tags: Array.isArray(task.tags)
          ? task.tags
          : [],
      })),
    [tasks]
  )

  const categories = useMemo(
    () => [
      ...new Set(
        normalizedTasks.map(
          (task) => task.category
        )
      ),
    ],
    [normalizedTasks]
  )

  const priorityValue = useCallback(
    (priority: string) => {
      switch (priority) {
        case 'High':
          return 3
        case 'Medium':
          return 2
        case 'Low':
          return 1
        default:
          return 0
      }
    },
    []
  )

  const handleAddTask = useCallback(
    (task: Record<string, unknown>) => {
      if (!dispatch) return

      const newTask: Task = {
        id:
          typeof task.id === 'string' ||
          typeof task.id === 'number'
            ? task.id
            : Date.now(),

        title:
          typeof task.title === 'string'
            ? task.title
            : '',

        description:
          typeof task.description === 'string'
            ? task.description
            : '',

        priority:
          typeof task.priority === 'string'
            ? task.priority
            : 'Low',

        completed:
          typeof task.completed === 'boolean'
            ? task.completed
            : false,

        category:
          typeof task.category === 'string'
            ? task.category
            : 'General',

        tags: Array.isArray(task.tags)
          ? task.tags.filter(
              (tag): tag is string =>
                typeof tag === 'string'
            )
          : [],

        dueDate:
          typeof task.dueDate === 'string' ||
          typeof task.dueDate === 'number'
            ? task.dueDate
            : undefined,
      }

      dispatch({
        type: 'ADD_TASK',
        payload: newTask,
      })
    },
    [dispatch]
  )

  const handleToggle = useCallback(
    (id: string | number) => {
      dispatch?.({
        type: 'TOGGLE_TASK',
        payload: id,
      })
    },
    [dispatch]
  )

  const handleDelete = useCallback(
    (id: string | number) => {
      dispatch?.({
        type: 'DELETE_TASK',
        payload: id,
      })
    },
    [dispatch]
  )

  const handleUpdateTask = useCallback(
    (
      id: string | number,
      updates: {
        title: string
        description: string
        priority: string
        category: string
        tags: string[]
        dueDate?: string | number
      }
    ) => {
      if (!updates.title.trim()) return

      dispatch?.({
        type: 'UPDATE_TASK',
        payload: {
          id,
          ...updates,
        },
      })

      setEditingId(null)
    },
    [dispatch]
  )

  const displayedTasks = useMemo(() => {
    let result = [...normalizedTasks]

    if (filter === 'active') {
      result = result.filter(
        (task) => !task.completed
      )
    }

    if (filter === 'completed') {
      result = result.filter(
        (task) => task.completed
      )
    }

    if (categoryFilter !== 'all') {
      result = result.filter(
        (task) =>
          task.category === categoryFilter
      )
    }

    const searchText =
      debouncedSearch.trim().toLowerCase()

    if (searchText) {
      result = result.filter((task) => {
        const tags = Array.isArray(task.tags)
          ? task.tags.join(' ')
          : ''

        return (
          task.title
            .toLowerCase()
            .includes(searchText) ||
          task.description
            .toLowerCase()
            .includes(searchText) ||
          task.category
            .toLowerCase()
            .includes(searchText) ||
          tags
            .toLowerCase()
            .includes(searchText)
        )
      })
    }

    result.sort((a, b) => {
      switch (sortOrder) {
        case 'high-low':
          return (
            priorityValue(b.priority) -
            priorityValue(a.priority)
          )

        case 'low-high':
          return (
            priorityValue(a.priority) -
            priorityValue(b.priority)
          )

        case 'alphabetical':
          return a.title.localeCompare(b.title)

        case 'due-date': {
          const aDate = a.dueDate
            ? new Date(a.dueDate).getTime()
            : Infinity

          const bDate = b.dueDate
            ? new Date(b.dueDate).getTime()
            : Infinity

          return aDate - bDate
        }

        case 'recent':
        default:
          return (
            Number(b.id) - Number(a.id)
          )
      }
    })

    return result
  }, [
    normalizedTasks,
    filter,
    categoryFilter,
    debouncedSearch,
    sortOrder,
    priorityValue,
  ])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
    },
    []
  )

  const handleClearSearch = useCallback(() => {
    setSearch('')
    setDebouncedSearch('')

    window.setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
  }, [])

  const countText =
    `Showing ${displayedTasks.length} of ${normalizedTasks.length} tasks`

  return (
    <div id="task-app">
      {showForm && (
        <TaskForm
          onAddTask={handleAddTask}
        />
      )}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          search={search}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          searchInputRef={searchInputRef}
          categories={categories}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />
      )}

      {showStatsPanel && (
        <StatsPanel
          tasks={normalizedTasks}
        />
      )}

      <ErrorBoundary>
        <TaskList
          tasks={displayedTasks}
          countText={countText}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
          setEditingId={setEditingId}
          linkToTaskDetail={linkToTaskDetail}
        />
      </ErrorBoundary>
    </div>
  )
}