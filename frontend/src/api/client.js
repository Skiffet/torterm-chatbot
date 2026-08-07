// The seam between the UI and the backend.
//
// Nothing in this phase talks to a server. Every call below resolves from
// local mock state after a short delay so the UI exercises its real loading,
// error and success paths. When the Django endpoints land, each function body
// is replaced with a fetch against `/api/...` (Vite already proxies that to
// localhost:8000) and no component has to change.

const LATENCY_MS = 650

export function delay(ms = LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Mirrors the shape a failed API call will take, so error handling written
 *  now keeps working against the real thing. */
export class ApiError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}
