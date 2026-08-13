import TaskCard from './TaskCard'
import type { Task } from '../reducers/taskReducer'

export type { Task }

interface TaskListProps {
  tasks?: Task[]
  countText?: string

  onToggle?: (id: string | number) => void

  onDelete?: (id: string | number) => void

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

  editingId?: string | number | null

  setEditingId?: (
    id: string | number | null
  ) => void

  linkToTaskDetail?: boolean
}

const HARDCODED_TASKS: Task[] = [
  {
    id: 1,
    title: 'Task One',
    description: 'First hardcoded task',
    priority: 'High',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 2,
    title: 'Task Two',
    description: 'Second hardcoded task',
    priority: 'Medium',
    completed: false,
    category: 'Work',
    tags: [],
  },
  {
    id: 3,
    title: 'Task Three',
    description: 'Third hardcoded task',
    priority: 'Low',
    completed: false,
    category: 'Personal',
    tags: [],
  },
]

export default function TaskList({
  tasks,
  countText,
  onToggle,
  onDelete,
  onUpdateTask,
  editingId,
  setEditingId,
  linkToTaskDetail = false,
}: TaskListProps) {
  const taskList = tasks ?? HARDCODED_TASKS

  return (
    <>
      {countText && (
        <div id="task-count">
          {countText}
        </div>
      )}

      <section id="task-list">
        {taskList.map((task) => (
          <TaskCard
            key={task.id}
            taskId={task.id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            completed={task.completed}
            category={task.category || 'General'}
            tags={task.tags || []}
            dueDate={task.dueDate}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdateTask={onUpdateTask}
            editingId={editingId}
            setEditingId={setEditingId}
            linkToTaskDetail={linkToTaskDetail}
          />
        ))}
      </section>
    </>
  )
}