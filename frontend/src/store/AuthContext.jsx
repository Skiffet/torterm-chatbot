import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'torterm.auth'

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  // Rehydrate lazily so a "Remember me" session survives reload. Everything
  // here is mock — no token, no network, no credential ever leaves the tab.
  const [user, setUser] = useState(readStored)
  const [pending, setPending] = useState(false)

  // The entry overlay. `withTransition` decides whether the door-opening clip
  // plays first (hero CTA) or the panel appears immediately (navbar button).
  const [entry, setEntry] = useState(null) // null | { withTransition: boolean }

  const enterWithTransition = useCallback(() => setEntry({ withTransition: true }), [])
  const openAuth = useCallback(() => setEntry({ withTransition: false }), [])
  const closeEntry = useCallback(() => setEntry(null), [])

  const persist = useCallback((nextUser, remember) => {
    if (!remember) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    } catch {
      /* storage unavailable (private mode) — session stays in memory only */
    }
  }, [])

  // Simulated latency so loading states are visible and honest about being mock.
  const login = useCallback(
    async ({ email, remember }) => {
      setPending(true)
      await new Promise((r) => setTimeout(r, 900))
      const nextUser = { name: email.split('@')[0], email }
      setUser(nextUser)
      persist(nextUser, remember)
      setPending(false)
      return nextUser
    },
    [persist],
  )

  const register = useCallback(
    async ({ fullName, email }) => {
      setPending(true)
      await new Promise((r) => setTimeout(r, 1100))
      const nextUser = { name: fullName, email }
      setUser(nextUser)
      persist(nextUser, true)
      setPending(false)
      return nextUser
    },
    [persist],
  )

  const logout = useCallback(() => {
    setUser(null)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* nothing to clean up */
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      pending,
      entry,
      enterWithTransition,
      openAuth,
      closeEntry,
      login,
      register,
      logout,
    }),
    [user, pending, entry, enterWithTransition, openAuth, closeEntry, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
