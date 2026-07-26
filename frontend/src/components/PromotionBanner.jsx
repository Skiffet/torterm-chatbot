import { useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const SLIDES = ['/images/promotion-banner.jpg', '/images/promotion-banner-2.jpg']

export default function PromotionBanner() {
  const { t } = useLanguage()
  const trackRef = useRef(null)

  const scrollByDirection = (direction) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.92, behavior: 'smooth' })
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pb-10 md:pb-14">
      <div className="relative">
        {/* Scroll track — each slide is narrower than the frame, so the next
            slide visibly peeks in and gets clipped by the frame edge, same
            as the product carousel. */}
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {SLIDES.map((src, i) => (
            <div
              key={src}
              className="shrink-0 w-[82%] md:w-[78%] snap-start rounded-3xl overflow-hidden shadow-sm"
            >
              <img
                src={src}
                alt={`${t('promotion.alt')} ${i + 1}`}
                className="w-full h-auto block"
              />
            </div>
          ))}
        </div>

        {/* Click-to-scroll arrows — native horizontal scroll isn't discoverable
            with a plain mouse (needs a trackpad or shift+wheel), so give
            everyone an obvious way to move between slides. */}
        <button
          type="button"
          onClick={() => scrollByDirection(-1)}
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByDirection(1)}
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
