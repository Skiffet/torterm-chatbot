import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const UIContext = createContext(null)

/** Which full-screen surface is open, if any.
 *
 * Only one can be open at a time, so this is a single value rather than a flag
 * per overlay — opening the cart from inside search closes search on the way. */
export function UIProvider({ children }) {
  const [overlay, setOverlay] = useState(null) // null | 'auth' | 'cart' | 'search' | 'menu'
  const [authMode, setAuthMode] = useState('login') // login | register

  const close = useCallback(() => setOverlay(null), [])
  const openCart = useCallback(() => setOverlay('cart'), [])
  const openSearch = useCallback(() => setOverlay('search'), [])
  const openMenu = useCallback(() => setOverlay('menu'), [])
  const openAuth = useCallback((mode = 'login') => {
    setAuthMode(mode)
    setOverlay('auth')
  }, [])

  // Escape closes whatever is open, from anywhere.
  useEffect(() => {
    if (!overlay) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [overlay, close])

  // Freeze the page behind the overlay. Compensating for the scrollbar width
  // keeps the layout from jumping sideways as it disappears.
  useEffect(() => {
    if (!overlay) return undefined
    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [overlay])

  const value = useMemo(
    () => ({ overlay, authMode, setAuthMode, close, openCart, openSearch, openMenu, openAuth }),
    [overlay, authMode, close, openCart, openSearch, openMenu, openAuth],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within a UIProvider')
  return ctx
}
