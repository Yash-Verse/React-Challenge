import StatsPanel from './StatsPanel'
import type { Dispatch, SetStateAction } from 'react'
import { useMemo, useEffect, useState } from 'react'
import FilterBar from './FilterBar'
import TaskForm from './TaskForm'
import TaskList, { type Task } from './TaskList'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>

  dispatch?: (
    action: {
      type: string
      payload?: unknown
    }
  ) => void

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
  showStatsPanel,
  countFormat,
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
    useState<
      string | number | null
    >(null)
  
    
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
   * Category list for FilterBar
   */
  const categories = [
    ...new Set(
      taskList
        .map(
          (task) =>
            task.category || 'General'
        )
        .filter(Boolean)
    ),
  ]

  /*
   * Challenge 06:
   * Status filtering
   */
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

  /*
   * Challenge 12:
   * Category filtering
   */
  const categoryFilteredTasks =
    category === 'All'
      ? filteredTasks
      : filteredTasks.filter(
          (task) =>
            (task.category ||
              'General') === category
        )

  /*
   * Challenge 09 + 11:
   * Search after status/category filtering
   */
  const searchedTasks =
    categoryFilteredTasks.filter(
      (task) => {
        const searchTerm =
          debouncedSearch
            .trim()
            .toLowerCase()

        if (!searchTerm) {
          return true
        }

        return (
          task.title
            .toLowerCase()
            .includes(searchTerm) ||
          task.description
            .toLowerCase()
            .includes(searchTerm)
        )
      }
    )

  /*
   * Challenge 07 + 13:
   * Sorting happens AFTER filtering and searching.
   */
  const sortedTasks = [
    ...searchedTasks,
  ].sort((a, b) => {
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

      /*
       * Challenge 13:
       * Due Date - Soonest First
       *
       * Tasks with a due date come first.
       * Tasks without a due date go last.
       */
      case 'due': {
        const aDate = a.dueDate
          ? new Date(a.dueDate).getTime()
          : Infinity

        const bDate = b.dueDate
          ? new Date(b.dueDate).getTime()
          : Infinity

        return aDate - bDate
      }

      /*
       * Recently Added:
       * Preserve original order.
       */
      case 'recent':
      default:
        return 0
    }
  })

  const completedCount =
    taskList.filter(
      (task) => task.completed
    ).length

  const countText =
    showFilterBar
      ? `Showing ${sortedTasks.length} of ${taskList.length} tasks`
      : countFormat === 'completed'
      ? `${completedCount} of ${taskList.length} completed`
      : `${taskList.length} tasks`
  
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
   * Add Task
   */
  function handleAddTask(
    task: Task
  ) {
    const newTask: Task = {
      ...task,
      category:
        task.category || 'General',
      tags: task.tags ?? [],
      dueDate:
        task.dueDate || undefined,
    }

    if (setTasks) {
      setTasks((prev) => [
        ...prev,
        newTask,
      ])
    } else {
      setLocalTasks((prev) => [
        ...prev,
        newTask,
      ])
    }
  }

  /*
   * Toggle completed
   */
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

  /*
   * Delete
   */
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

  /*
   * Challenge 08 + 13:
   * Update task, including dueDate
   */
  function handleUpdateTask(
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
      dueDate?: string
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
          onAddTask={handleAddTask}
        />
      )}

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
      
      {showStatsPanel && (
         <StatsPanel  total={stats.total}
         completed={stats.completed}
         active={stats.active}
         overdue={stats.overdue}
          completedPercentage={stats.percentage}/>
        )}

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
    </>
  )
}

