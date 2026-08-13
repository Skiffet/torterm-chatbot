import { useAuth } from '../store/AuthContext'

// Closing band: a full-bleed dimmed photograph carrying one line of copy and a
// single outlined action. Deliberately quieter than the hero — it hands the
// page over to the footer rather than competing with the top of the site.
export default function CTASection() {
  const { openAuth } = useAuth()

  return (
    <section id="cta" className="relative isolate overflow-hidden bg-ink">
      <img
        src="/images/interior-living.jpg"
        alt="Living space opening onto a renovated garden"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Two stacked scrims: a flat dim so the photo reads as texture, plus a
          left-heavy gradient that keeps the headline legible on any crop. */}
      <div className="absolute inset-0 bg-ink/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/40" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-28 md:py-40">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight text-balance">
            Start with the home you want to change
          </h2>
          <p className="mt-6 text-base md:text-xl text-white/70 leading-relaxed">
            Browse the full catalogue without an account, or sign up to keep the materials you pick.
          </p>
          <button
            onClick={openAuth}
            className="mt-10 inline-flex items-center justify-center border border-white/40 px-10 py-4 text-white text-sm md:text-base font-semibold tracking-wide hover:bg-white hover:text-ink hover:border-white transition-colors duration-300"
          >
            Create an account
          </button>
        </div>
      </div>
    </section>
  )
}
