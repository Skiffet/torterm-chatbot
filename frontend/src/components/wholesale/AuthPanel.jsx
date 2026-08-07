import { useState } from 'react'
import Icon from './Icon'
import { useAuth } from '../../store/AuthContext'
import { useToast } from '../../store/ToastContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validateLogin({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Email is required'
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address'
  if (!password) errors.password = 'Password is required'
  else if (password.length < 8) errors.password = 'At least 8 characters'
  return errors
}

function validateRegister(v) {
  const errors = {}
  if (!v.fullName.trim()) errors.fullName = 'Full name is required'
  if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Enter a valid email address'
  if (v.password.length < 8) errors.password = 'At least 8 characters'
  if (!v.accepted) errors.accepted = 'You must accept the terms to continue'
  return errors
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">
        {label}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-[11px] text-red-300">
          <Icon name="close" className="w-3 h-3" strokeWidth={2.6} />
          {error}
        </span>
      )}
    </label>
  )
}

const inputClass = (error) =>
  `w-full rounded-xl bg-white/10 border px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors backdrop-blur-sm ${
    error ? 'border-red-400/60 focus:border-red-400' : 'border-white/15 focus:border-safety focus:bg-white/15'
  }`

export default function AuthPanel({ onDone }) {
  const { login, register, pending } = useAuth()
  const { toast } = useToast()

  const [tab, setTab] = useState('login')
  const [errors, setErrors] = useState({})

  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: true })
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    accepted: false,
  })

  const switchTab = (next) => {
    setTab(next)
    setErrors({})
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const found = validateLogin(loginForm)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    const user = await login(loginForm)
    toast(`เข้าสู่ระบบสำเร็จ — welcome back, ${user.name}`)
    onDone?.()
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const found = validateRegister(registerForm)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    const user = await register(registerForm)
    toast(`สมัครสมาชิกสำเร็จ — account created for ${user.name}`)
    onDone?.()
  }

  const oauth = (provider) => {
    toast(`${provider} sign-in is mocked in this build — no account was contacted.`, {
      variant: 'info',
    })
  }

  return (
    <div className="relative rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="p-6 sm:p-8">
        <div className="flex p-1 rounded-full bg-black/25 border border-white/10 mb-6">
          {[
            { id: 'login', label: 'Log In', th: 'เข้าสู่ระบบ' },
            { id: 'register', label: 'Register', th: 'สมัครสมาชิก' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => switchTab(item.id)}
              className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${
                tab === item.id
                  ? 'bg-safety text-ink shadow-lg shadow-safety/25'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {item.label}
              <span className="block text-[10px] font-medium opacity-70">{item.th}</span>
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} noValidate className="space-y-4">
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                autoComplete="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@company.co.th"
                className={inputClass(errors.email)}
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <input
                type="password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className={inputClass(errors.password)}
              />
            </Field>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-white/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={loginForm.remember}
                  onChange={(e) => setLoginForm((f) => ({ ...f, remember: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/25 bg-white/10 accent-safety"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => toast('Password reset is not wired up in this build.', { variant: 'info' })}
                className="text-safety-light hover:text-safety transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>

            <SubmitButton pending={pending} label="เข้าสู่ระบบ" />
          </form>
        ) : (
          <form onSubmit={handleRegister} noValidate className="space-y-4">
            <Field label="Full name" error={errors.fullName}>
              <input
                type="text"
                autoComplete="name"
                value={registerForm.fullName}
                onChange={(e) => setRegisterForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="สมชาย ก่อสร้าง"
                className={inputClass(errors.fullName)}
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                autoComplete="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@company.co.th"
                className={inputClass(errors.email)}
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <input
                type="password"
                autoComplete="new-password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="At least 8 characters"
                className={inputClass(errors.password)}
              />
            </Field>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={registerForm.accepted}
                onChange={(e) => setRegisterForm((f) => ({ ...f, accepted: e.target.checked }))}
                className="mt-0.5 w-4 h-4 rounded border-white/25 bg-white/10 accent-safety shrink-0"
              />
              <span className="text-[11px] text-white/65 leading-relaxed">
                I accept the Terms of Service and Privacy Policy.
              </span>
            </label>
            {errors.accepted && (
              <span className="flex items-center gap-1 text-[11px] text-red-300 -mt-2">
                <Icon name="close" className="w-3 h-3" strokeWidth={2.6} />
                {errors.accepted}
              </span>
            )}

            <SubmitButton pending={pending} label="สมัครสมาชิก" />
          </form>
        )}

        <div className="mt-6">
          <div className="flex items-center gap-3 text-[11px] text-white/35 uppercase tracking-widest">
            <span className="h-px flex-1 bg-white/15" />
            or
            <span className="h-px flex-1 bg-white/15" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => oauth('Google')}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-3 py-3 text-sm font-semibold text-white transition-colors"
            >
              <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-[#4285F4]">
                G
              </span>
              Google
            </button>
            <button
              type="button"
              onClick={() => oauth('LINE')}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-3 py-3 text-sm font-semibold text-white transition-colors"
            >
              <span className="w-4 h-4 rounded-md bg-[#06C755] flex items-center justify-center text-[9px] font-black text-white">
                L
              </span>
              LINE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmitButton({ pending, label }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-safety hover:bg-safety-dark disabled:opacity-70 disabled:cursor-wait text-ink font-bold py-3.5 transition-colors shadow-lg shadow-safety/20"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-ink/30 border-t-ink animate-spin" />
          Processing…
        </span>
      ) : (
        label
      )}
    </button>
  )
}
