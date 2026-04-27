import { useAuth } from './contexts/AuthContext'
import TodoList from './components/TodoList'
import AuthForm from './components/AuthForm'

function App() {
  const { user } = useAuth()
  return (
    <div>
      <h1>My Todo App</h1>
      {user ? <TodoList /> : <AuthForm />}
    </div>
  )
}

export default App
