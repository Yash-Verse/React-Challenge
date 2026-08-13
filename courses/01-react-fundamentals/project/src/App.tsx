import { useReducer } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import FetchDemoView from './components/FetchDemoView'
import TaskApp from './components/TaskApp'
import TaskDetailPage from './components/TaskDetailPage'

import { ThemeProvider } from './contexts/ThemeContext'
import { taskReducer } from './reducers/taskReducer'
import type { Task } from './reducers/taskReducer'

const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: 'First Task',
    description: 'Description one',
    priority: 'High',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 2,
    title: 'Second Task',
    description: 'Description two',
    priority: 'Medium',
    completed: true,
    category: 'General',
    tags: [],
  },
]

export default function App() {
  const [tasks, dispatch] = useReducer(
    taskReducer,
    INITIAL_TASKS
  )

  return (
    <ThemeProvider>
      <Routes> <Route
  path="/challenge/23-useref-focus-management"
  element={
    <TaskApp
      tasks={tasks}
      dispatch={dispatch}
      showForm={false}
      showFilterBar={true}
      showStatsPanel={false}
      linkToTaskDetail={false}
    />
  }
/> <Route
  path="/challenge/22-data-fetching"
  element={<FetchDemoView />}
/>
        {/* Challenge 21 task list */}
        <Route
          path="/challenge/21-react-router"
          element={
            <TaskApp
              tasks={tasks}
              dispatch={dispatch}
              showForm={true}
              showFilterBar={true}
              showStatsPanel={true}
              linkToTaskDetail={true}
            />
          }
        />

        {/* Challenge 21 dynamic task detail */}
        <Route
          path="/challenge/21-react-router/task/:id"
          element={<TaskDetailPage />}
        />

        {/* Keep the app usable if opened at / */}
        <Route
          path="/"
          element={
            <Navigate
              to="/challenge/21-react-router"
              replace
            />
          }
        />
      </Routes>
    </ThemeProvider>
  )
}