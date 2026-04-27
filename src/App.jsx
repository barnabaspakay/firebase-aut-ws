import { useAuth } from './contexts/AuthContext'
import TodoList from './components/TodoList'
// Segment 3: import AuthForm from './components/AuthForm'

function App() {
  const { user } = useAuth()
  console.log('Current user:', user)

  return (
    <div>
      <h1>My Todo App</h1>
      {/* Segment 4: protect this */}
      <TodoList />
    </div>
  )
}

export default App
