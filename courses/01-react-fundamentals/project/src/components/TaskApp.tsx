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

export default function TaskApp({
  tasks,
  setTasks,
  showForm,
  showFilterBar,
}: TaskAppProps) {
  const [localTasks, setLocalTasks] =
    useState<Task[]>(DEFAULT_TASKS)

  const [filter, setFilter] = useState<
    'all' | 'active' | 'completed'
  >('all')

  const taskList = tasks ?? localTasks

  const filteredTasks =
    filter === 'active'
      ? taskList.filter((task) => !task.completed)
      : filter === 'completed'
        ? taskList.filter((task) => task.completed)
        : taskList

  const completedCount = taskList.filter(
    (task) => task.completed
  ).length

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

  return (
    <>
      {showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
        />
      )}

      <TaskList
        tasks={filteredTasks}
        countText={`Showing ${filteredTasks.length} of ${taskList.length} tasks`}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </>
  )
}