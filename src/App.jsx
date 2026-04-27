import { useAuth } from './contexts/AuthContext'
import TodoList from './components/TodoList'
import AuthForm from './components/AuthForm'

function App() {
  const { user } = useAuth()

  return (
    <div>
      <h1>My Todo App</h1>
      {/* Segment 4: show TodoList only when logged in */}
      <TodoList />
    </div>
  )
}

export default App
