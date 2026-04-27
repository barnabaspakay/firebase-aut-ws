import { useState, useEffect } from 'react'
import { ref, push, onValue, remove } from 'firebase/database'
import { db } from '../firebase'
// Segment 5: import useAuth from '../contexts/AuthContext'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  // Segment 5: get user and logOut from useAuth()

  useEffect(() => {
    // Segment 5: change this path to todos/${user.uid}
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
    // Segment 5: add user to the dependency array
  }, [])

  function addTodo(e) {
    e.preventDefault()
    if (!input.trim()) return
    // Segment 5: change this path to todos/${user.uid}
    push(ref(db, 'todos'), { text: input })
    setInput('')
  }

  function deleteTodo(id) {
    // Segment 5: change this path to todos/${user.uid}/${id}
    remove(ref(db, `todos/${id}`))
  }

  return (
    <div>
      {/* Segment 4: show user.email and a sign-out button here */}
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
