import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)

const ICONS = {
  success: 'M20 6 9 17l-5-5',
  error: 'M18 6 6 18M6 6l12 12',
  info: 'M12 16v-4M12 8h.01',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (message, { variant = 'success', duration = 3600 } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((list) => [...list, { id, message, variant }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      )
      return id
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast-in pointer-events-auto w-full flex items-start gap-3 rounded-2xl bg-ink-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 px-4 py-3"
          >
            <span
              className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${
                t.variant === 'error'
                  ? 'bg-red-500/20 text-red-300'
                  : t.variant === 'info'
                    ? 'bg-primary/25 text-blue-200'
                    : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              >
                <path d={ICONS[t.variant] ?? ICONS.info} />
              </svg>
            </span>
            <p className="text-sm text-white/90 leading-snug flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-white/40 hover:text-white/80 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
