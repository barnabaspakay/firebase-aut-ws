import { useEffect } from 'react'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import TodoList from './components/TodoList'

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state:', user)
    })
    return unsubscribe
  }, [])

  return (
    <div>
      <h1>My Todo App</h1>
      <TodoList />
    </div>
  )
}

export default App
