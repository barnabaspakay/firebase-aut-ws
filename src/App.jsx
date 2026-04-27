import TodoList from './components/TodoList'
// Segment 2: import useAuth from './contexts/AuthContext'
// Segment 3: import AuthForm from './components/AuthForm'

function App() {
  // Segment 2: get user from useAuth()

  return (
    <div>
      <h1>My Todo App</h1>
      {/* Segment 4: show TodoList if logged in, AuthForm if not */}
      <TodoList />
    </div>
  )
}

export default App
