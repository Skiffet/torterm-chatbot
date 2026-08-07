import { useEffect, useRef, useState } from 'react'
import { DEMO_CREDENTIALS } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { useLanguage } from '../../i18n/LanguageContext'

function Field({ id, label, type = 'text', value, onChange, autoComplete, required = true }) {
  return (
    <label htmlFor={id} className="block">
      {/* Field labels are Thai in the default language, so they take the sans
          face rather than the mono one used for Latin eyebrows. */}
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="mt-1.5 w-full border border-line bg-white px-3.5 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
      />
    </label>
  )
}

export default function AuthModal() {
  const { t } = useLanguage()
  const { overlay, authMode, setAuthMode, close } = useUI()
  const { login, register, status, error, clearError, user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [succeeded, setSucceeded] = useState(false)
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)

  const open = overlay === 'auth'
  const isRegister = authMode === 'register'
  const pending = status === 'pending'

  // Reset whenever the modal is opened or the mode is switched, so a previous
  // failure never greets someone opening a fresh form.
  useEffect(() => {
    if (!open) return
    setSucceeded(false)
    clearError()
    const timer = setTimeout(() => firstFieldRef.current?.querySelector('input')?.focus(), 60)
    return () => clearTimeout(timer)
  }, [open, authMode, clearError])

  // Close once the success state has been seen.
  useEffect(() => {
    if (!succeeded) return undefined
    const timer = setTimeout(close, 1400)
    return () => clearTimeout(timer)
  }, [succeeded, close])

  // Keep tabbing inside the dialog while it is open.
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll(
        'button, input, a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!open) return null

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      if (isRegister) await register({ name, email, password })
      else await login({ email, password })
      setSucceeded(true)
    } catch {
      // The error is already on the context; the form shows it below.
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button
        type="button"
        aria-label={t('common.close')}
        onClick={close}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative w-full sm:max-w-md bg-white max-h-[92vh] overflow-y-auto"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                {t('auth.eyebrow')}
              </p>
              <h2 id="auth-title" className="text-display mt-2 text-2xl font-semibold text-ink">
                {isRegister ? t('auth.registerTitle') : t('auth.loginTitle')}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={t('common.close')}
              className="w-9 h-9 -mr-2 -mt-1 flex items-center justify-center text-gray-400 hover:text-ink transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {succeeded ? (
            <div className="mt-8 py-8 text-center">
              <span className="mx-auto w-12 h-12 bg-signal flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <p className="mt-4 font-medium text-ink">
                {t('auth.successTitle')(user?.name ?? '')}
              </p>
              <p className="mt-1 text-sm text-gray-500">{t('auth.successBody')}</p>
            </div>
          ) : (
            <>
              <form onSubmit={onSubmit} className="mt-7 space-y-4">
                {isRegister && (
                  <div ref={isRegister ? firstFieldRef : null}>
                    <Field
                      id="auth-name"
                      label={t('auth.name')}
                      value={name}
                      onChange={setName}
                      autoComplete="name"
                    />
                  </div>
                )}
                <div ref={isRegister ? null : firstFieldRef}>
                  <Field
                    id="auth-email"
                    label={t('auth.email')}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                  />
                </div>
                <Field
                  id="auth-password"
                  label={t('auth.password')}
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />

                {!isRegister && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      {t('auth.remember')}
                    </label>
                    <button type="button" className="text-primary hover:underline">
                      {t('auth.forgot')}
                    </button>
                  </div>
                )}

                {error && (
                  <p
                    role="alert"
                    className="border-l-2 border-red-500 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-ink text-white font-semibold py-3.5 transition-colors hover:bg-primary disabled:opacity-60"
                >
                  {pending
                    ? t('auth.pending')
                    : isRegister
                      ? t('auth.registerAction')
                      : t('auth.loginAction')}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-gray-500">
                {isRegister ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode(isRegister ? 'login' : 'register')}
                  className="text-primary font-medium hover:underline"
                >
                  {isRegister ? t('auth.loginAction') : t('auth.registerAction')}
                </button>
              </p>

              {/* This build has no backend. Say so plainly rather than letting
                  someone guess why their own account does not work. */}
              <div className="mt-6 border border-line bg-concrete/50 px-4 py-3">
                <p className="text-[11px] font-medium tracking-[0.04em] text-gray-500">
                  {t('auth.demoLabel')}
                </p>
                <p className="mt-1.5 font-mono text-xs text-ink">{DEMO_CREDENTIALS.email}</p>
                <p className="font-mono text-xs text-ink">{DEMO_CREDENTIALS.password}</p>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(DEMO_CREDENTIALS.email)
                    setPassword(DEMO_CREDENTIALS.password)
                    setAuthMode('login')
                  }}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  {t('auth.demoFill')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
