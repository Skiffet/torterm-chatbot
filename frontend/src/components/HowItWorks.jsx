import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './wholesale/Icon'
import { HOTSPOTS, HOW_IT_WORKS_STEPS, discountPct } from '../data/showcaseHotspots'

const CYCLE_MS = 3800

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [pinned, setPinned] = useState(false)

  // Auto-tour the hotspots so the idea reads without interaction, then hand
  // control over permanently once the visitor picks one themselves.
  useEffect(() => {
    if (pinned) return undefined
    const timer = setInterval(
      () => setActiveIndex((i) => (i + 1) % HOTSPOTS.length),
      CYCLE_MS,
    )
    return () => clearInterval(timer)
  }, [pinned])

  const select = (index) => {
    setActiveIndex(index)
    setPinned(true)
  }

  const active = HOTSPOTS[activeIndex]

  return (
    <section id="how-it-works" className="relative bg-ink-900 overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-grid-fade [background-size:56px_56px] opacity-30 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ---- Left: the pitch ---- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <span className="text-[11px] font-bold text-safety uppercase tracking-[0.32em]">
              How it works
            </span>

            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              Your house tells us
              <br />
              what it needs.
            </h2>

            <p className="mt-5 text-steel-400 text-base md:text-lg leading-relaxed max-w-md">
              A catalogue only tells you what is for sale. Torterm reads a photo of your
              home, points at the exact material every surface needs, and prices the whole
              job before you commit to it.
            </p>

            <ol className="mt-10">
              {HOW_IT_WORKS_STEPS.map((step, i) => (
                <motion.li
                  key={step.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex gap-5 py-6 border-t border-white/10 last:border-b"
                >
                  <span className="text-xs font-bold text-steel-500 tabular-nums pt-1 shrink-0 group-hover:text-safety transition-colors">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="text-white font-bold text-base md:text-lg leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-steel-400 text-sm mt-1.5 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ol>

            <a
              href="#products"
              className="group mt-9 inline-flex items-center gap-2 bg-safety hover:bg-safety-dark text-ink font-bold px-7 py-3.5 rounded-full transition-colors shadow-xl shadow-safety/20"
            >
              Browse the catalogue
              <Icon
                name="arrow"
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                strokeWidth={2.4}
              />
            </a>
          </motion.div>

          {/* ---- Right: annotated room ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="relative rounded-[1.75rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <img
                src="/images/interior-living.jpg"
                alt="Modern Thai living room with materials identified by Torterm"
                className="w-full h-auto block"
              />

              {/* Keeps the dots and card readable against the bright window. */}
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-900/55 via-transparent to-ink-900/25" />

              {HOTSPOTS.map((spot, i) => {
                const isActive = i === activeIndex
                return (
                  <button
                    key={spot.id}
                    onClick={() => select(i)}
                    aria-label={`Show material for ${spot.zone}`}
                    aria-pressed={isActive}
                    style={{ left: `${spot.point.x}%`, top: `${spot.point.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <span className="relative flex items-center justify-center w-7 h-7">
                      {isActive && (
                        <motion.span
                          initial={{ scale: 0.6, opacity: 0.8 }}
                          animate={{ scale: 2.1, opacity: 0 }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                          className="absolute inset-0 rounded-full bg-safety"
                        />
                      )}
                      <span
                        className={`relative w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                          isActive
                            ? 'bg-safety border-white scale-110'
                            : 'bg-white/35 border-white/80 backdrop-blur-sm hover:bg-white/70'
                        }`}
                      />
                    </span>
                  </button>
                )
              })}

              {/* Desktop: card floats beside its dot. */}
              <div className="hidden md:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={active.card}
                    className="absolute z-20 w-[17rem]"
                  >
                    <HotspotCard spot={active} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Zone switcher — discoverable on every breakpoint. */}
            <div className="mt-4 flex flex-wrap gap-2">
              {HOTSPOTS.map((spot, i) => (
                <button
                  key={spot.id}
                  onClick={() => select(i)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    i === activeIndex
                      ? 'bg-safety text-ink'
                      : 'bg-white/10 text-white/55 border border-white/15 hover:text-white hover:border-white/30'
                  }`}
                >
                  {spot.zone}
                </button>
              ))}
            </div>

            {/* Mobile: card sits below the image so it never covers the room. */}
            <div className="md:hidden mt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <HotspotCard spot={active} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function HotspotCard({ spot }) {
  const { product, zone } = spot
  const off = discountPct(product)

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noreferrer"
      className="group flex gap-3 rounded-2xl border border-white/15 bg-ink-900/90 backdrop-blur-xl p-3 shadow-2xl shadow-black/60 hover:border-safety/50 transition-colors"
    >
      <span className="w-16 h-16 shrink-0 rounded-xl bg-white overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-1"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-safety uppercase tracking-wider">{zone}</span>
          {off > 0 && (
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-safety text-ink">
              -{off}%
            </span>
          )}
        </span>

        <span className="block text-[13px] font-semibold text-white leading-snug mt-1 line-clamp-2">
          {product.name}
        </span>

        <span className="flex items-baseline gap-1.5 mt-1.5">
          <span className="text-sm font-extrabold text-white tabular-nums">
            ฿{product.price.toLocaleString('en-US')}
          </span>
          {off > 0 && (
            <span className="text-[11px] text-white/35 line-through tabular-nums">
              ฿{product.originalPrice.toLocaleString('en-US')}
            </span>
          )}
          <span className="text-[10px] text-white/40">{product.unit}</span>
        </span>
      </span>
    </a>
  )
}
