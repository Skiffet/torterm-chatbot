import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AuthPanel from './AuthPanel'
import Icon from './Icon'
import { useAuth } from '../../store/AuthContext'

// Pacing for the whole entry beat, kept together so the sequence can be tuned
// in one place. The clip is nudged slightly past 1x rather than cut short —
// the door still opens fully, it just gets there sooner.
const CLIP_RATE = 1.2
const CLIP_SECONDS = 5.05 // measured from the file's mvhd box
const OVERLAY_FADE = 0.3
const DIM_FADE = 0.6
const PANEL_FADE = 0.55
// Fallback reveal, with headroom over the sped-up clip's real runtime.
const PANEL_FALLBACK_MS = (CLIP_SECONDS / CLIP_RATE) * 1000 + 1000

// Full-screen entry overlay. When opened from the hero it first plays the
// door-opening clip, then settles on its final frame and fades the auth card
// in on top. Opened from the navbar it skips straight to the card.
export default function EntryExperience() {
  const { entry, closeEntry, isLoggedIn, user, logout } = useAuth()
  const [showPanel, setShowPanel] = useState(false)

  const open = entry !== null
  const withTransition = entry?.withTransition ?? false

  useEffect(() => {
    if (!open) {
      setShowPanel(false)
      return undefined
    }

    // No clip to wait for — reveal immediately.
    if (!withTransition) setShowPanel(true)

    const onKey = (e) => {
      if (e.key === 'Escape') closeEntry()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, withTransition, closeEntry])

  // Safety net: if the clip stalls or the file is missing, never trap the user
  // behind a video that will not finish.
  useEffect(() => {
    if (!open || !withTransition) return undefined
    const timer = setTimeout(() => setShowPanel(true), PANEL_FALLBACK_MS)
    return () => clearTimeout(timer)
  }, [open, withTransition])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: OVERLAY_FADE }}
          className="fixed inset-0 z-[95] overflow-hidden bg-ink"
          role="dialog"
          aria-modal="true"
          aria-label="Sign in"
        >
          {withTransition ? (
            <video
              // playbackRate resets whenever a new source loads, so set it on
              // the element itself rather than once on mount.
              ref={(el) => {
                if (el) el.playbackRate = CLIP_RATE
              }}
              onLoadedMetadata={(e) => {
                e.currentTarget.playbackRate = CLIP_RATE
              }}
              src="/video/enter-house.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={() => setShowPanel(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/interior-living.jpg')" }}
            />
          )}

          {/* Darkening pass that only arrives with the panel, so the clip plays
              clean and the card lands on a readable backdrop. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showPanel ? 1 : 0 }}
            transition={{ duration: DIM_FADE }}
            className="absolute inset-0 bg-gradient-to-br from-ink-900/80 via-ink/75 to-ink/90 backdrop-blur-[2px]"
          />

          <button
            onClick={closeEntry}
            aria-label="Close"
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/15 text-white/70 hover:text-white hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-colors"
          >
            <Icon name="close" className="w-4 h-4" strokeWidth={2.4} />
          </button>

          <AnimatePresence>
            {showPanel && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: PANEL_FADE, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full w-full overflow-y-auto flex items-center justify-center p-5"
              >
                <div className="w-full max-w-md my-auto">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {isLoggedIn ? `ยินดีต้อนรับ, ${user.name}` : 'ยินดีต้อนรับเข้าบ้าน'}
                    </h2>
                    <p className="text-steel-300 text-sm mt-1.5">
                      {isLoggedIn
                        ? 'You are signed in.'
                        : 'Sign in to order materials at trade prices.'}
                    </p>
                  </div>

                  {isLoggedIn ? (
                    <div className="rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-2xl shadow-black/50 p-8 text-center">
                      <span className="mx-auto w-16 h-16 rounded-2xl bg-safety flex items-center justify-center text-ink">
                        <Icon name="user" className="w-8 h-8" strokeWidth={2} />
                      </span>
                      <p className="mt-4 text-white font-bold text-lg">{user.name}</p>
                      <p className="text-white/50 text-sm">{user.email}</p>
                      <div className="mt-7 flex gap-3">
                        <button
                          onClick={closeEntry}
                          className="flex-1 bg-safety hover:bg-safety-dark text-ink font-bold py-3 rounded-xl transition-colors"
                        >
                          เริ่มเลือกซื้อ
                        </button>
                        <button
                          onClick={logout}
                          aria-label="Log out"
                          className="px-4 rounded-xl border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors"
                        >
                          <Icon name="logout" className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <AuthPanel onDone={closeEntry} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
