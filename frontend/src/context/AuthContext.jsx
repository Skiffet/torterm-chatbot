import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

/** Session state for the UI.
 *
 * The user object lives in memory only — signing in does not persist across a
 * reload, because there is no server to persist against yet. Once real auth
 * lands the httpOnly session cookie makes that work without changing any
 * consumer of this hook. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('idle') // idle | pending | error
  const [error, setError] = useState(null)

  const login = useCallback(async (credentials) => {
    setStatus('pending')
    setError(null)
    try {
      const nextUser = await authApi.login(credentials)
      setUser(nextUser)
      setStatus('idle')
      return nextUser
    } catch (err) {
      setError(err.message)
      setStatus('error')
      throw err
    }
  }, [])

  const register = useCallback(async (details) => {
    setStatus('pending')
    setError(null)
    try {
      const nextUser = await authApi.register(details)
      setUser(nextUser)
      setStatus('idle')
      return nextUser
    } catch (err) {
      setError(err.message)
      setStatus('error')
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setStatus('idle')
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    setStatus('idle')
  }, [])

  const value = useMemo(
    () => ({ user, status, error, login, register, logout, clearError }),
    [user, status, error, login, register, logout, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
