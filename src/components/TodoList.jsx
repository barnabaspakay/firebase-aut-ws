import { useState, useEffect } from 'react'
import { ref, push, onValue, remove } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const { user, logOut } = useAuth()

  useEffect(() => {
    // Segment 5: change to todos/${user.uid}
    const todosRef = ref(db, 'todos')
    const unsubscribe = onValue(todosRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const list = Object.entries(data).map(([id, value]) => ({ id, ...value }))
        setTodos(list)
      } else {
        setTodos([])
      }
    })
    return unsubscribe
  }, [user])

  function addTodo(e) {
    e.preventDefault()
    if (!input.trim()) return
    // Segment 5: change to todos/${user.uid}
    push(ref(db, 'todos'), { text: input })
    setInput('')
  }

  function deleteTodo(id) {
    // Segment 5: change to todos/${user.uid}/${id}
    remove(ref(db, `todos/${id}`))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{user.email}</span>
        <button onClick={logOut}>Sign out</button>
      </div>
      <h2>My Todos</h2>
      <form onSubmit={addTodo}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="New todo..."
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
