import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Segment 2: import AuthProvider from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Segment 2: wrap App with AuthProvider */}
    <App />
  </React.StrictMode>
)
