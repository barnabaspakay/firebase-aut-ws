import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
// Segment 3: import createUserWithEmailAndPassword, signInWithEmailAndPassword,
//            signOut, onAuthStateChanged from 'firebase/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Segment 2: add state for user (null) and loading (true)

  // Segment 2: subscribe to auth state with onAuthStateChanged
  //            update user, set loading to false when it fires

  // Segment 3: add signUp(email, password) function
  // Segment 3: add signIn(email, password) function
  // Segment 3: add logOut() function

  const value = {
    // Segment 2: user
    // Segment 3: signUp, signIn, logOut
  }

  return (
    <AuthContext.Provider value={value}>
      {/* Segment 2: render children only when not loading */}
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
