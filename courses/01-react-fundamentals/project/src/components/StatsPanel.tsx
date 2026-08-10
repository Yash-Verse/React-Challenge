import { useMemo } from 'react'
import type { Task } from './TaskList'

interface StatsPanelProps {
  tasks?: Task[]
  total?: number
  completed?: number
  active?: number
  overdue?: number
  completedPercentage?: number
}

export default function StatsPanel({
  tasks = [],
  total,
  completed,
  active,
  overdue,
  completedPercentage,
}: StatsPanelProps) {
  const stats = useMemo(() => {
    // If tasks are provided, calculate everything from tasks
    if (tasks.length > 0) {
      const totalTasks = tasks.length

      const completedTasks = tasks.filter(
        (task) => task.completed
      ).length

      const activeTasks = tasks.filter(
        (task) => !task.completed
      ).length

      const overdueTasks = tasks.filter((task) => {
        if (!task.dueDate || task.completed) {
          return false
        }

        const dueDate = new Date(
          `${task.dueDate}T00:00:00`
        )

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return dueDate < today
      }).length

      const percentage =
        totalTasks === 0
          ? 0
          : Math.round(
              (completedTasks / totalTasks) * 100
            )

      return {
        total: totalTasks,
        completed: completedTasks,
        active: activeTasks,
        overdue: overdueTasks,
        completedPercentage: percentage,
      }
    }

    // Support direct values used by tests/other callers
    const finalTotal = total ?? 0
    const finalCompleted = completed ?? 0
    const finalActive =
      active ?? finalTotal - finalCompleted
    const finalOverdue = overdue ?? 0

    const percentage =
      completedPercentage ??
      (finalTotal === 0
        ? 0
        : Math.round(
            (finalCompleted / finalTotal) * 100
          ))

    return {
      total: finalTotal,
      completed: finalCompleted,
      active: finalActive,
      overdue: finalOverdue,
      completedPercentage: percentage,
    }
  }, [
    tasks,
    total,
    completed,
    active,
    overdue,
    completedPercentage,
  ])

  return (
    <section id="stats-panel">
      <h2>Task Statistics</h2>

      <p>
        Total: {stats.total}
      </p>

      <p>
        Completed: {stats.completed} (
        {stats.completedPercentage}%)
      </p>

      <p>
        Active: {stats.active}
      </p>

      <p>
        Overdue: {stats.overdue}
      </p>

      <div
        role="progressbar"
        aria-valuenow={
          stats.completedPercentage
        }
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{
            width: `${stats.completedPercentage}%`,
            height: '10px',
          }}
        />
      </div>
    </section>
  )
}