import type { Dispatch, SetStateAction } from 'react'
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
}: TaskAppProps) {
  const taskList = tasks && tasks.length > 0 ? tasks : DEFAULT_TASKS

  return (
    <>
      <div id="task-count">{taskList.length} Tasks</div>

      <TaskList tasks={taskList} />
    </>
  )
}