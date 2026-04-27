# Authentication — Concepts

## What is authentication?

Authentication is the process of verifying **who you are**.

When you log in to a website, you're proving your identity — usually with a password.
The site then gives you a **token**: a proof that says "this person is who they say they are."
Every time you make a request after that, the token travels with it, so the server knows it's still you.

Without authentication, any data in your app is public — there's no way to know who is making a request.

---

## The authentication flow

Here's what happens step by step when a user signs in:

```
User enters email + password
         │
         ▼
Firebase checks credentials
         │
    ┌────┴────┐
    │         │
  Match    No match
    │         │
    ▼         ▼
Token      Error returned
created    (wrong password, etc.)
    │
    ▼
Token stored in the browser
(localStorage / IndexedDB)
    │
    ▼
Future page loads:
Firebase reads the token → user is still logged in
```

This is why you don't have to log in every time you open a new tab.
The token is stored locally and Firebase validates it silently on every page load.

---

## `onAuthStateChanged` — the observer

Firebase doesn't give you the current user as a simple value you can just read.
Instead, it gives you an **observer**: a function you register, and Firebase calls it whenever the auth state changes.

```js
onAuthStateChanged(auth, (user) => {
  // Firebase calls this:
  // - when the page first loads (even if no one just logged in)
  // - when a user signs in
  // - when a user signs out
  if (user) {
    console.log('Logged in as:', user.email)
  } else {
    console.log('Not logged in')
  }
})
```

This fires **on every page load** — Firebase checks the stored token and immediately tells you the current auth state.

### Why does this matter?
Without it, you'd have to store the user in localStorage yourself, validate the token manually, and handle expiration. `onAuthStateChanged` handles all of that for you.

### Cleanup
`onAuthStateChanged` returns an **unsubscribe function**.
In a React `useEffect`, you return it as the cleanup to avoid memory leaks:

```js
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user)
  })
  return unsubscribe  // React calls this when the component unmounts
}, [])
```

---

## Why `useContext` for auth state?

The logged-in user is needed in many places:
- `App` needs it to decide what to render
- `TodoList` needs it to scope the database path
- `AuthForm` needs it to call `signIn` / `signUp`

Without Context, you'd have to pass `user` and all auth functions as props through every layer — a pattern called **prop drilling**.

Context solves this: put the user in one place, read it anywhere.

```
<AuthProvider>       ← user lives here
  <App>
    <TodoList />     ← reads user directly, no props needed
    <AuthForm />     ← reads signIn directly, no props needed
  </App>
</AuthProvider>
```

---

## The `loading` state

When the page first loads, Firebase hasn't checked the token yet.
For a brief moment, `user` is `null` — even if the user is actually logged in.

Without a loading guard, this causes a **flash**: the login form appears for a split second, then switches to the app. That looks broken.

The fix:

```jsx
// Don't render anything until Firebase has told us the auth state
{!loading && children}
```

This means: wait until `onAuthStateChanged` has fired at least once before showing any UI.

---

## `user.uid` — connecting auth to data

Every Firebase user has a unique `uid` (user ID) — a string like `"abc123xyz"`.
This is the key that connects the auth service to the database service.

Instead of storing todos at a shared path:
```
/todos
  ├── -abc: "Buy milk"
  └── -def: "Do laundry"
```

We store them under each user's ID:
```
/todos
  ├── uid_alice
  │     ├── -abc: "Buy milk"
  │     └── -def: "Do laundry"
  └── uid_bob
        └── -xyz: "Fix bike"
```

Alice reads from `todos/uid_alice`. Bob reads from `todos/uid_bob`. They never see each other's data.

In code, this is just a string interpolation:
```js
const todosRef = ref(db, `todos/${user.uid}`)
```

---

## Firebase Database Security Rules

`user.uid` in the path is not enough on its own to secure the data — anyone could theoretically read `todos/another_uid` if the database rules allow it.

To make it truly secure, you set a database rule:

```json
{
  "rules": {
    "todos": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

This says: you can only read or write `todos/X` if you are logged in as user X.

This is covered in a future session — for today, the important thing is the concept of scoping the path by `user.uid`.

---

## Summary

| Concept | What it does |
|---------|-------------|
| `getAuth()` | Initializes the Firebase Auth service |
| `onAuthStateChanged` | Fires whenever auth state changes — the main way to track login state |
| `createUserWithEmailAndPassword` | Creates a new account |
| `signInWithEmailAndPassword` | Signs in an existing user |
| `signOut` | Signs the user out, clears the token |
| `user.uid` | Unique user ID — used to scope data in the database |
| `AuthContext` | React Context that makes user + auth functions available app-wide |
| `loading` state | Guards against the brief moment before Firebase confirms auth state |
