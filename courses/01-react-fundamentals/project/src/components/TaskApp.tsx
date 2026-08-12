import StatsPanel from './StatsPanel'
import {
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react'
import FilterBar from './FilterBar'
import TaskForm from './TaskForm'
import TaskList, { type Task } from './TaskList'
import { useTheme } from '../contexts/ThemeContext'
import type { TaskAction } from '../reducers/taskReducer'
import ErrorBoundary from './ErrorBoundary'

interface TaskAppProps {
  tasks?: Task[]
  dispatch?: (action: TaskAction) => void

  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean

  onDelete?: (
    id: string | number
  ) => void

  linkToTaskDetail?: boolean
}

const DEFAULT_TASKS: Task[] = [
  {
    id: 1,
    title: 'First Task',
    description: 'This is the first task.',
    priority: 'High',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 2,
    title: 'Second Task',
    description: 'This is the second task.',
    priority: 'Medium',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 3,
    title: 'Third Task',
    description: 'This is the third task.',
    priority: 'Low',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 4,
    title: 'Fourth Task',
    description: 'This is the fourth task.',
    priority: 'High',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 5,
    title: 'Fifth Task',
    description: 'This is the fifth task.',
    priority: 'Medium',
    completed: false,
    category: 'General',
    tags: [],
  },
]

const priorityOrder: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
}

export default function TaskApp({
  tasks,
  dispatch,
  showForm,
  showFilterBar,
  showStatsPanel,
  countFormat,
  onDelete,
}: TaskAppProps) {
  const [localTasks, setLocalTasks] =
    useState<Task[]>(DEFAULT_TASKS)

  const taskList = tasks ?? localTasks

  const [filter, setFilter] = useState<
    'all' | 'active' | 'completed'
  >('all')

  const [sort, setSort] = useState<
    'recent' | 'high' | 'low' | 'alpha' | 'due'
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
    useState<string | number | null>(null)

  const { theme, toggleTheme } = useTheme()

  /*
   * Challenge 11:
   * Debounced search
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [search])

  /*
   * Challenge 12:
   * Category list
   */
  const categories = useMemo(() => {
    return [
      ...new Set(
        taskList
          .map(
            (task) =>
              task.category || 'General'
          )
          .filter(Boolean)
      ),
    ]
  }, [taskList])

  /*
   * Challenge 19:
   * Filter, category filter, search and sort
   * are memoized so they only recalculate
   * when their dependencies change.
   */
  const sortedTasks = useMemo(() => {
    /*
     * Status filtering
     */
    let result =
      filter === 'active'
        ? taskList.filter(
            (task) => !task.completed
          )
        : filter === 'completed'
        ? taskList.filter(
            (task) => task.completed
          )
        : taskList

    /*
     * Category filtering
     */
    if (category !== 'All') {
      result = result.filter(
        (task) =>
          (task.category || 'General') ===
          category
      )
    }

    /*
     * Search
     */
    const searchTerm =
      debouncedSearch
        .trim()
        .toLowerCase()

    if (searchTerm) {
      result = result.filter((task) => {
        return (
          task.title
            .toLowerCase()
            .includes(searchTerm) ||
          task.description
            .toLowerCase()
            .includes(searchTerm)
        )
      })
    }

    /*
     * Sorting
     */
    return [...result].sort((a, b) => {
      switch (sort) {
        case 'high':
          return (
            (priorityOrder[
              b.priority.replace(
                'Priority: ',
                ''
              )
            ] ?? 0) -
            (priorityOrder[
              a.priority.replace(
                'Priority: ',
                ''
              )
            ] ?? 0)
          )

        case 'low':
          return (
            (priorityOrder[
              a.priority.replace(
                'Priority: ',
                ''
              )
            ] ?? 0) -
            (priorityOrder[
              b.priority.replace(
                'Priority: ',
                ''
              )
            ] ?? 0)
          )

        case 'alpha':
          return a.title.localeCompare(
            b.title,
            undefined,
            {
              sensitivity: 'base',
            }
          )

        case 'due': {
          const aDate = a.dueDate
            ? new Date(
                a.dueDate
              ).getTime()
            : Infinity

          const bDate = b.dueDate
            ? new Date(
                b.dueDate
              ).getTime()
            : Infinity

          return aDate - bDate
        }

        case 'recent':
        default:
          return 0
      }
    })
  }, [
    taskList,
    filter,
    category,
    debouncedSearch,
    sort,
  ])

  /*
   * Completed count
   */
  const completedCount = useMemo(() => {
    return taskList.filter(
      (task) => task.completed
    ).length
  }, [taskList])

  /*
   * Count text
   */
  const countText =
    showFilterBar
      ? `Showing ${sortedTasks.length} of ${taskList.length} tasks`
      : countFormat === 'completed'
      ? `${completedCount} of ${taskList.length} completed`
      : `${taskList.length} tasks`

  /*
   * Challenge 14:
   * Statistics
   */
  const stats = useMemo(() => {
    const total = taskList.length

    const completed = taskList.filter(
      (task) => task.completed
    ).length

    const active = taskList.filter(
      (task) => !task.completed
    ).length

    const today = new Date()

    today.setHours(0, 0, 0, 0)

    const overdue = taskList.filter(
      (task) => {
        if (
          task.completed ||
          !task.dueDate
        ) {
          return false
        }

        const dueDate = new Date(
          `${task.dueDate}T00:00:00`
        )

        return dueDate < today
      }
    ).length

    const percentage =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
          )

    return {
      total,
      completed,
      percentage,
      active,
      overdue,
    }
  }, [taskList])

  /*
   * Challenge 18 + 19:
   * ADD_TASK
   */
  const handleAddTask = useCallback(
    (task: Task) => {
      const newTask: Task = {
        ...task,
        category:
          task.category || 'General',
        tags: task.tags ?? [],
        dueDate:
          task.dueDate || undefined,
      }

      if (dispatch) {
        dispatch({
          type: 'ADD_TASK',
          payload: newTask,
        })
      } else {
        setLocalTasks((prev) => [
          ...prev,
          newTask,
        ])
      }
    },
    [dispatch]
  )

  /*
   * Challenge 18 + 19:
   * TOGGLE_TASK
   */
  const handleToggle = useCallback(
    (id: string | number) => {
      if (dispatch) {
        dispatch({
          type: 'TOGGLE_TASK',
          payload: id,
        })
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
    },
    [dispatch]
  )

  /*
   * Challenge 18 + 19:
   * DELETE_TASK
   */
  const handleDelete = useCallback(
    (id: string | number) => {
      if (onDelete) {
        onDelete(id)
        return
      }

      if (dispatch) {
        dispatch({
          type: 'DELETE_TASK',
          payload: id,
        })
      } else {
        setLocalTasks((prev) =>
          prev.filter(
            (task) => task.id !== id
          )
        )
      }
    },
    [dispatch, onDelete]
  )

  /*
   * Challenge 18 + 19:
   * UPDATE_TASK
   */
  const handleUpdateTask = useCallback(
    (
      id: string | number,
      updates: {
        title: string
        description: string
        priority: string
        dueDate?: string
      }
    ) => {
      if (dispatch) {
        dispatch({
          type: 'UPDATE_TASK',
          payload: {
            id,
            ...updates,
          },
        })
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
    },
    [dispatch]
  )

  /*
   * Clear search
   */
  const handleClearSearch = useCallback(() => {
    setSearch('')
  }, [])

  return (
    <>
      {/* Challenge 16: Theme toggle */}
      <button
        id="theme-toggle"
        type="button"
        onClick={toggleTheme}
      >
        {theme === 'light'
          ? 'Dark Mode'
          : 'Light Mode'}
      </button>

      {/* Challenge 03+ */}
      {showForm && (
        <TaskForm
          onAddTask={handleAddTask}
        />
      )}

      {/* Challenge 06+ */}
      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          search={search}
          onSearchChange={setSearch}
          onClearSearch={
            handleClearSearch
          }
          searching={
            search !== debouncedSearch
          }
          category={category}
          categories={categories}
          onCategoryChange={
            setCategory
          }
        />
      )}

      {/* Challenge 14 */}
      {showStatsPanel && (
        <StatsPanel
          total={stats.total}
          completed={stats.completed}
          active={stats.active}
          overdue={stats.overdue}
          completedPercentage={
            stats.percentage
          }
        />
      )}

      {/* Task list */}
    <ErrorBoundary>
      <TaskList
        tasks={sortedTasks}
        countText={countText}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onUpdateTask={
          handleUpdateTask
        }
        editingId={editingId}
        setEditingId={
          setEditingId
        }
      />
    </ErrorBoundary>
    </>
  )
}