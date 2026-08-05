import TaskCard from './TaskCard'

export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskList({ tasks }: TaskListProps) {
  const hardcodedTasks: Task[] = [
    {
      id: 1,
      title: 'Task One',
      description: 'First hardcoded task',
      priority: 'Priority: High',
      completed: false,
    },
    {
      id: 2,
      title: 'Task Two',
      description: 'Second hardcoded task',
      priority: 'Priority: Medium',
      completed: false,
    },
    {
      id: 3,
      title: 'Task Three',
      description: 'Third hardcoded task',
      priority: 'Priority: Low',
      completed: false,
    },
  ]

  const taskList = tasks && tasks.length > 0 ? tasks : hardcodedTasks

  return (
    <section
      id="task-list"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {taskList.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
        />
      ))}
    </section>
  )
}