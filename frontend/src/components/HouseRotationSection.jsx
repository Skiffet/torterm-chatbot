import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './wholesale/Icon'
import { useLanguage } from '../i18n/LanguageContext'

const FRAME_COUNT = 151
// Each frame is one 2.38° step, so the 151 frames add up to exactly one turn.
const DEG_PER_FRAME = 360 / FRAME_COUNT
// The flat backdrop baked into every WebP. Painting the canvas with the same
// colour before each draw means the letterboxing left by "contain" scaling is
// invisible at any aspect ratio instead of reading as black bars.
const FRAME_BG = '#0B1222'
// Retina is worth paying for; 3x on a phone is four times the fill rate for
// pixels nobody can resolve.
const MAX_DPR = 2
// Browsers only keep a handful of connections open per origin anyway. A small
// pool keeps the loading percentage moving steadily rather than stalling on
// one 151-request burst.
const PRELOAD_CONCURRENCY = 8

const frameSrc = (index) => `/frames/frame_${String(index + 1).padStart(4, '0')}.webp`

// Scroll windows for the five copy beats, as a fraction of the section's own
// scroll distance. Gaps between them are deliberate — the house gets a moment
// alone before the next line arrives.
const BEATS = [
  { start: 0.0, end: 0.1 },
  { start: 0.15, end: 0.32 },
  { start: 0.38, end: 0.55 },
  { start: 0.6, end: 0.78 },
  { start: 0.85, end: 1.0 },
]
const FADE = 0.2 // portion of a beat's window spent fading in and again out
const SHIFT_PX = 20

const BEAT_ICONS = ['spark', 'roof', 'card', 'truck', 'cart']

const RING_RADIUS = 28
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const clamp01 = (n) => Math.min(1, Math.max(0, n))

// Opacity and vertical offset for one beat at the current progress. The first
// beat skips its fade-in and the last skips its fade-out, so arriving at the
// section — or reaching the end of it — never lands on blank copy.
function beatStyle(progress, index) {
  const { start, end } = BEATS[index]
  const local = (progress - start) / (end - start)
  if (local < 0 || local > 1) return [0, 0]

  let opacity = 1
  if (local < FADE && index > 0) opacity = local / FADE
  else if (local > 1 - FADE && index < BEATS.length - 1) opacity = (1 - local) / FADE

  // Rises into place on the way in, keeps drifting up on the way out.
  return [opacity, (1 - opacity) * SHIFT_PX * (local < 0.5 ? 1 : -1)]
}

export default function HouseRotationSection() {
  const { t } = useLanguage()

  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const readoutRef = useRef(null)
  const beatRefs = useRef([])

  const framesRef = useRef([])
  const frameIndexRef = useRef(0)
  const tickingRef = useRef(false)

  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [armed, setArmed] = useState(false)
  const [started, setStarted] = useState(false)
  const [loaded, setLoaded] = useState(0)

  const beats = t('houseRotation.beats') || []
  const totalFrames = reduceMotion ? 1 : FRAME_COUNT
  const ready = started && loaded >= totalFrames

  /* ---------------------------------------------------------------- canvas */

  const draw = useCallback((index) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    // canvas.width/height are device pixels; the contain maths works in the
    // same space, so no ctx.scale() is involved.
    const { width, height } = canvas
    ctx.fillStyle = FRAME_BG
    ctx.fillRect(0, 0, width, height)

    const img = framesRef.current[index]
    if (!img || !img.naturalWidth) return

    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h)
  }, [])

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const w = Math.round(canvas.clientWidth * dpr)
    const h = Math.round(canvas.clientHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    // Resizing the backing store clears it, so always repaint.
    draw(frameIndexRef.current)
  }, [draw])

  /* ---------------------------------------------------------------- scrub  */

  const update = useCallback(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return

    // Measured against the sticky stage rather than window.innerHeight: on
    // mobile the two disagree while the browser chrome collapses, and the
    // stage is what actually governs how far the pin travels.
    const rect = section.getBoundingClientRect()
    const distance = rect.height - stage.offsetHeight
    const progress = distance <= 0 ? 0 : clamp01(-rect.top / distance)

    const index = Math.round(progress * (FRAME_COUNT - 1))
    if (index !== frameIndexRef.current) {
      frameIndexRef.current = index
      draw(index)
    }

    // Copy is driven straight through the DOM. Putting progress in state
    // would re-render five beats on every scroll frame, competing with the
    // canvas for the same 16 ms.
    beatRefs.current.forEach((el, i) => {
      if (!el) return
      const [opacity, y] = beatStyle(progress, i)
      el.style.opacity = opacity
      el.style.transform = `translate3d(0, ${y}px, 0)`
      // Keeps the faded-out CTA from swallowing clicks.
      el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none'
    })

    if (readoutRef.current) {
      readoutRef.current.textContent = `${Math.round(index * DEG_PER_FRAME)}°`
    }
  }, [draw])

  /* --------------------------------------------------------------- effects */

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduceMotion(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // The hero is exactly one viewport tall, so this section's top edge already
  // sits on the fold — an observer attached at mount reports "near the
  // viewport" before the visitor has scrolled a single pixel, and the 151
  // frames end up racing the hero video for bandwidth. Arm the observer only
  // once the page has finished loading and the main thread has gone quiet.
  useEffect(() => {
    let handle
    const schedule = (fn) =>
      window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 300)
    const unschedule = (id) =>
      window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id)

    const arm = () => {
      handle = schedule(() => setArmed(true))
    }

    if (document.readyState === 'complete') {
      arm()
      return () => unschedule(handle)
    }
    window.addEventListener('load', arm)
    return () => {
      window.removeEventListener('load', arm)
      unschedule(handle)
    }
  }, [])

  // Preload only once the section is close to the viewport.
  useEffect(() => {
    const el = sectionRef.current
    if (!armed || !el || started) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setStarted(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true)
          observer.disconnect()
        }
      },
      // Negative bottom margin, not the usual positive lead: the section's
      // top edge is already on the fold, so a positive margin buys no warning
      // and just means every visitor pays 6 MB whether they scroll or not.
      // Shrinking the root instead makes the section earn its download by
      // rising ~10% of a viewport into view — still leaving the rest of the
      // hero plus the 600vh runway to finish loading in.
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [armed, started])

  useEffect(() => {
    if (!started) return undefined

    let cancelled = false
    const total = reduceMotion ? 1 : FRAME_COUNT
    const images = []
    framesRef.current = images
    setLoaded(0)

    let cursor = 0
    let done = 0

    const loadFrame = (index) =>
      new Promise((resolve) => {
        const img = new Image()
        img.decoding = 'async'

        const settle = (ok) => {
          if (ok) images[index] = img
          done += 1
          if (!cancelled) {
            setLoaded(done)
            // Paint as soon as the opening frame lands so the panel is never
            // a bare navy rectangle while the rest streams in.
            if (index === 0) draw(0)
          }
          resolve()
        }

        img.onload = () => settle(true)
        img.onerror = () => settle(false)
        img.src = frameSrc(index)
      })

    const worker = async () => {
      while (!cancelled && cursor < total) {
        await loadFrame(cursor++)
      }
    }

    Array.from({ length: Math.min(PRELOAD_CONCURRENCY, total) }, worker)

    return () => {
      cancelled = true
    }
  }, [started, reduceMotion, draw])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  useEffect(() => {
    if (reduceMotion) return undefined

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        tickingRef.current = false
        update()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduceMotion, update])

  // First real paint, once the sequence is in memory.
  useEffect(() => {
    if (!ready) return
    resize()
    if (!reduceMotion) update()
  }, [ready, reduceMotion, resize, update])

  const setBeatRef = (i) => (el) => {
    beatRefs.current[i] = el
  }

  const loader = !ready && (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5"
      style={{ backgroundColor: FRAME_BG }}
    >
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,.12)"
            strokeWidth="3"
          />
          <circle
            cx="32"
            cy="32"
            r={RING_RADIUS}
            fill="none"
            stroke="#F5A524"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - loaded / totalFrames)}
            style={{ transition: 'stroke-dashoffset .2s linear' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums text-white">
          {Math.round((loaded / totalFrames) * 100)}%
        </span>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-steel-400">
        {t('houseRotation.loading')}
      </p>
    </div>
  )

  /* ------------------------------------------------------- reduced motion  */

  // No pin, no scrub, no 151-frame download: one still of the house and every
  // beat laid out at once.
  if (reduceMotion) {
    return (
      <section
        id="house-360"
        ref={sectionRef}
        style={{ backgroundColor: FRAME_BG }}
        className="relative w-full py-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="relative aspect-[1280/798] w-full overflow-hidden rounded-3xl border border-white/10">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={t('houseRotation.canvasLabel')}
              className="block h-full w-full"
            />
            {loader}
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {beats.map((beat, i) => (
              <div key={beat.title}>
                <BeatCopy beat={beat} icon={BEAT_ICONS[i]} />
                {i === beats.length - 1 && <BeatCta label={t('houseRotation.ctaLabel')} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  /* --------------------------------------------------------------- scrub   */

  return (
    <section
      id="house-360"
      ref={sectionRef}
      style={{ backgroundColor: FRAME_BG }}
      className="relative w-full h-[600vh]"
    >
      {/* The pinned stage. The canvas fills it, so the canvas itself is what
          stays fixed at the top of the viewport for the whole 600vh; the
          overlay rides along inside the same pin. */}
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={t('houseRotation.canvasLabel')}
          className="absolute inset-0 block h-full w-full"
        />

        {/* Scrims sized to where the copy actually sits at each breakpoint. */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: `linear-gradient(to top, ${FRAME_BG} 4%, ${FRAME_BG}D9 26%, transparent 62%)`,
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: `linear-gradient(to right, ${FRAME_BG}F2 0%, ${FRAME_BG}A6 38%, transparent 70%)`,
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-10">
          {beats.map((beat, i) => (
            <div key={beat.title} className="absolute inset-0 flex items-end md:items-center">
              <div className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-0">
                <div
                  ref={setBeatRef(i)}
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    pointerEvents: 'none',
                    willChange: 'opacity, transform',
                  }}
                  className="max-w-xl"
                >
                  <BeatCopy beat={beat} icon={BEAT_ICONS[i]} />
                  {i === beats.length - 1 && <BeatCta label={t('houseRotation.ctaLabel')} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rotation readout — written by hand on each frame, never re-rendered.
            Kept bottom-left: the floating AskAiButton owns the bottom-right. */}
        <div className="pointer-events-none absolute bottom-6 left-6 z-10 flex items-center gap-3 md:left-10">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
            {t('houseRotation.scrollHint')}
          </span>
          <span
            ref={readoutRef}
            className="min-w-[3.5rem] rounded-full border border-safety/30 bg-safety/10 px-3 py-1 text-center text-xs font-bold tabular-nums text-safety"
          >
            0°
          </span>
        </div>

        {loader}
      </div>
    </section>
  )
}

function BeatCopy({ beat, icon }) {
  return (
    <>
      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.32em] text-safety">
        <Icon name={icon} className="h-3.5 w-3.5" strokeWidth={2} />
        {beat.eyebrow}
      </span>

      <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl">
        {beat.title}
      </h2>

      <p className="mt-4 text-base leading-relaxed text-steel-300 md:text-lg">{beat.desc}</p>
    </>
  )
}

function BeatCta({ label }) {
  return (
    <a
      href="#products"
      className="group mt-7 inline-flex items-center gap-2 rounded-full bg-safety px-7 py-3.5 font-bold text-ink shadow-xl shadow-safety/20 transition-colors hover:bg-safety-dark"
    >
      {label}
      <Icon
        name="arrow"
        className="h-4 w-4 transition-transform group-hover:translate-x-1"
        strokeWidth={2.4}
      />
    </a>
  )
}
