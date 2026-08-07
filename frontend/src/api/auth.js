// Mock authentication. No credentials are verified and no session is created
// on any server — this exists so the Login and Register screens can be built,
// reviewed and tested before the backend exists.
//
// Replacing it: each function becomes a fetch to the matching Django endpoint
// (`POST /api/auth/login/`, `/register/`, `/logout/`, `GET /api/auth/me/`) and
// the session rides in an httpOnly cookie rather than the object returned here.
import { delay, ApiError } from './client'

const DEMO_EMAIL = 'demo@torterm.co.th'
const DEMO_PASSWORD = 'torterm1234'

function toUser(email, name) {
  return {
    id: 'mock-user-1',
    email,
    name: name || email.split('@')[0],
    memberSince: '2026',
    tier: 'ช่างประจำบ้าน',
  }
}

export async function login({ email, password }) {
  await delay()
  if (!email || !password) {
    throw new ApiError('missing_fields', 'กรอกอีเมลและรหัสผ่านให้ครบ')
  }
  // The demo account is the only one that succeeds; everything else exercises
  // the error state so it can be reviewed properly.
  if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    throw new ApiError('invalid_credentials', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
  }
  return toUser(DEMO_EMAIL, 'คุณธนธรรม')
}

export async function register({ name, email, password }) {
  await delay()
  if (!name || !email || !password) {
    throw new ApiError('missing_fields', 'กรอกข้อมูลให้ครบทุกช่อง')
  }
  if (password.length < 8) {
    throw new ApiError('weak_password', 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร')
  }
  if (email.trim().toLowerCase() === DEMO_EMAIL) {
    throw new ApiError('email_taken', 'อีเมลนี้ถูกใช้งานแล้ว')
  }
  return toUser(email, name)
}

export async function logout() {
  await delay(200)
}

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD }
