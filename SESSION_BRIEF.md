# Session Brief — Firebase Authentication with React

## Topic
Firebase Authentication (email/password) in a React + Vite app.
Auth state is shared across the component tree using `useContext`.
Todos are scoped per user via `user.uid` in the Realtime Database path.

## Learning Goal
By the end of the session, students will be able to:
- Explain what Firebase Auth does and why we need it
- Use `onAuthStateChanged` to track and persist login state
- Build an `AuthContext` that makes the current user available everywhere
- Protect content — show different UI depending on whether the user is logged in
- Store and retrieve data scoped to the logged-in user

## Prerequisites
- React: `useState`, `useEffect`, `useContext` (minor experience with context is OK)
- Firebase Realtime Database (they've used it already)
- `async/await` basics

## Estimated Duration
75 minutes

---

## Flow Overview

| # | Segment | Duration | What gets built |
|---|---------|----------|-----------------|
| 1 | Firebase Auth Setup | 15 min | Export `auth` from `firebase.js`, observe auth state with `onAuthStateChanged` in App |
| 2 | AuthContext | 15 min | `AuthProvider` with user/loading state, wrap app, consume with `useAuth()` |
| 3 | Sign Up & Sign In | 15 min | Add `signUp` / `signIn` / `logOut` to context, build the `AuthForm` component |
| 4 | Protect Content | 10 min | Conditional render in `App`, sign-out button with user email in `TodoList` |
| 5 | Scope Todos to User | 20 min | Change db path from `todos` → `todos/${user.uid}` — each user sees only their data |

---

## Segment Detail

### Segment 1 — Firebase Auth Setup (15 min)

**Talking point before coding:**
> "You already know how to set up the database — Firebase Auth works the same way: it's a separate service we initialize in `firebase.js`. The key new idea is `onAuthStateChanged`. It's a listener — whenever the auth state changes (login, logout, page refresh), it fires. This is how Firebase knows you're still logged in after you close the tab."

**Coding goal:**
- Add `getAuth` import and export `auth` from `firebase.js`
- In `App.jsx`, add a `useEffect` with `onAuthStateChanged` that logs the user to the console
- Refresh the page to show the listener fires and restores the user

**Class question:**
> "What do you think happens when we refresh the page — does the user stay logged in? Why or why not?"

---

### Segment 2 — AuthContext (15 min)

**Talking point before coding:**
> "Right now the user lives in `App`. But `TodoList` will also need it, and `AuthForm` will too. We could pass it as a prop everywhere — but that gets messy. Context lets us put data in one place and read it anywhere without prop drilling. You've seen this before. Today we build one from scratch."

**Coding goal:**
- Create `AuthContext.jsx` with `AuthProvider` and a `useAuth` custom hook
- Move `onAuthStateChanged` into the context; track `user` and `loading`
- `!loading && children` pattern to prevent flash of login screen on refresh
- Wrap `<App />` with `<AuthProvider>` in `main.jsx`
- In `App.jsx`, read `user` with `useAuth()` and log it to confirm it works

**Class question:**
> "Why do we have a `loading` state? What would happen visually if we didn't have it?"

---

### Segment 3 — Sign Up & Sign In (15 min)

**Talking point before coding:**
> "Firebase gives us two functions: `createUserWithEmailAndPassword` and `signInWithEmailAndPassword`. Both are async and return a promise. We'll put them inside the context so any component can call them. Then we'll build the form."

**Coding goal:**
- Add `signUp`, `signIn`, `logOut` to `AuthProvider` and expose them via `value`
- Build `AuthForm.jsx`: email + password fields, toggle between sign-up and sign-in mode, error display

**Class question:**
> "What would happen if we forgot the `await` before `signIn()`?"

**Expected answer:** The function returns immediately before Firebase responds. The user wouldn't be logged in yet, but the code would continue as if they were. Good moment to reinforce async flow.

---

### Segment 4 — Protect Content & Sign Out (10 min)

**Talking point before coding:**
> "Now that we know whether the user is logged in, let's use it. One ternary in `App` decides what the whole app shows. This is the simplest form of route protection."

**Coding goal:**
- In `App.jsx`: `{user ? <TodoList /> : <AuthForm />}`
- In `TodoList.jsx`: show `user.email` and a sign-out button via `logOut` from `useAuth()`

**Class question:**
> "Can you think of a case where a single ternary in App might not be enough? (Think: an app with many pages)"

---

### Segment 5 — Scope Todos to User (20 min)

**Talking point before coding:**
> "Right now every user sees the same todo list. That's because we're reading and writing to the path `todos` — shared by everyone. All we need to do is add the user's unique ID to the path: `todos/USER_ID`. Every user gets their own branch in the database."

**Coding goal:**
- Import `useAuth` in `TodoList`
- Get `user` from context
- Change all three database paths from `todos` / `todos/${id}` to `todos/${user.uid}` / `todos/${user.uid}/${id}`
- Add `user` to the `useEffect` dependency array

**Class question:**
> "Open the Firebase console. What does the database tree look like now? What would it look like if we'd kept the path as just `todos`?"

**Live demo:** Sign in as two different accounts, show that each sees only their own list.

---

## Key Things to Emphasize

- `onAuthStateChanged` fires on every page load — this is how Firebase remembers the user without you doing anything
- The `!loading && children` pattern is a real-world pattern, not just a trick
- `user.uid` is the bridge between Firebase Auth and the Realtime Database — two separate services that connect through this one string
- The `try/catch` in `AuthForm` is where Firebase errors surface — show what happens with a wrong password or a duplicate email

## Common Stumbling Points

| Problem | Likely cause |
|---------|-------------|
| "Auth not enabled" error | Email/Password not turned on in Firebase console |
| User is always `null` | `auth` not exported from `firebase.js`, or `AuthProvider` not wrapping the app |
| Blank screen on load | Missing `!loading &&` guard in `AuthProvider` |
| All users see same todos | Database path still `todos` instead of `todos/${user.uid}` |
| Form submits but nothing happens | Missing `await` before `signUp`/`signIn` |

## Before the Session

1. Make sure Email/Password is enabled in the Firebase console:
   Firebase console → Authentication → Sign-in method → Email/Password → Enable
2. Have your own Firebase config ready in `.env`
3. Create one test account to demo sign-in from segment 3 onward
