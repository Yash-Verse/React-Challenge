interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  taskId?: string | number
}

export default function TaskCard({
  title,
  description,
  priority,
}: TaskCardProps) {
  return (
    <article
      id="task-card"
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{priority}</p>
    </article>
  )
}