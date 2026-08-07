import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Icon from './Icon'
import { useAuth } from '../../store/AuthContext'

// Click-driven entry. The looping construction clip fills the viewport; a
// click pushes the camera forward (scale) and, once that push lands, hands
// over to the door-opening clip inside EntryExperience — so the two videos
// read as one continuous move from the site into the house.
export default function WholesaleHero() {
  const [zooming, setZooming] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const reduceMotion = useReducedMotion()
  const { enterWithTransition } = useAuth()

  const beginEntry = () => {
    if (zooming) return
    if (reduceMotion) {
      enterWithTransition()
      return
    }
    setZooming(true)
  }

  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden bg-ink">
      {/* Gradient underlay so the hero never flashes black on a cold load. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-800 via-ink-900 to-ink" />

      <motion.video
        src="/video/hero-build.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setVideoReady(true)}
        animate={{ scale: zooming ? 2.6 : 1 }}
        transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
        onAnimationComplete={() => {
          if (zooming) {
            enterWithTransition()
            // Reset so returning from the overlay shows the wide shot again.
            setZooming(false)
          }
        }}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/35 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(8,12,21,.9)_100%)]" />

      {/* Copy — fades out as the camera pushes in. */}
      <motion.div
        animate={{ opacity: zooming ? 0 : 1, y: zooming ? -40 : 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-center"
      >
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-safety bg-safety/10 border border-safety/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
            <Icon name="spark" className="w-3.5 h-3.5" strokeWidth={2} />
            วัสดุก่อสร้างครบ จบที่เดียว
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
            Build it for less,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-safety-light via-safety to-safety-dark">
              deliver it faster.
            </span>
          </h1>

          <p className="mt-5 text-base md:text-xl text-steel-300 max-w-xl leading-relaxed">
            ศูนย์รวมวัสดุก่อสร้างราคาส่งสำหรับช่างและผู้รับเหมา — พร้อมผู้ช่วย AI
            ที่ดูรูปหน้างานแล้วแนะนำวัสดุให้ได้ทันที
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={beginEntry}
              className="group inline-flex items-center justify-center gap-2 bg-safety hover:bg-safety-dark text-ink font-bold px-7 py-4 rounded-full transition-colors shadow-xl shadow-safety/20"
            >
              เข้าสู่ระบบเพื่อสั่งซื้อ
              <Icon
                name="arrow"
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                strokeWidth={2.4}
              />
            </button>
            <a
              href="#categories"
              className="inline-flex items-center justify-center gap-2 border border-white/25 bg-white/5 backdrop-blur-md text-white font-semibold px-7 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              ดูสินค้าทั้งหมด
            </a>
          </div>
        </div>
      </motion.div>

      {/* Click-anywhere affordance, sitting under the copy so buttons still win. */}
      <button
        onClick={beginEntry}
        aria-label="เข้าสู่บ้าน — open sign in"
        className="absolute inset-0 z-0 cursor-pointer"
        tabIndex={-1}
      />

      <motion.div
        animate={{ opacity: zooming ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 pointer-events-none"
      >
        <span className="text-[11px] uppercase tracking-[0.25em]">คลิกเพื่อเข้าบ้าน</span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center"
        >
          <Icon name="arrow" className="w-4 h-4 rotate-90" strokeWidth={2} />
        </motion.span>
      </motion.div>
    </section>
  )
}
