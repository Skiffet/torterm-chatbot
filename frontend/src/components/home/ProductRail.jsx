import { useRef } from 'react'
import ProductCard from '../ProductCard'
import Reveal from '../ui/Reveal'
import { useLanguage } from '../../i18n/LanguageContext'

/** A horizontally scrolling row of products.
 *
 * Wraps the existing ProductCard rather than restyling a second card — the
 * rails and the full grid below stay identical as a result. Arrow buttons
 * exist because native horizontal scroll is invisible to anyone on a mouse
 * without a horizontal wheel.
 */
export default function ProductRail({ id, eyebrow, title, description, products, status, tone = 'light' }) {
  const { t } = useLanguage()
  const trackRef = useRef(null)

  const scrollByDirection = (direction) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  const dark = tone === 'dark'

  return (
    <section id={id} className={dark ? 'bg-ink py-20 md:py-24' : 'py-16 md:py-20'}>
      <div className="max-w-page mx-auto px-6 md:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div className="max-w-xl">
            <p className={`font-mono text-xs uppercase tracking-[0.2em] ${dark ? 'text-signal' : 'text-primary'}`}>
              {eyebrow}
            </p>
            <h2
              className={`text-display mt-3 text-2xl md:text-[2.1rem] font-semibold ${
                dark ? 'text-white' : 'text-ink'
              }`}
            >
              {title}
            </h2>
            {description && (
              <p className={`mt-2.5 text-sm md:text-base ${dark ? 'text-white/55' : 'text-gray-500'}`}>
                {description}
              </p>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {[-1, 1].map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => scrollByDirection(direction)}
                aria-label={direction === -1 ? t('rail.previous') : t('rail.next')}
                className={`w-10 h-10 border flex items-center justify-center transition-colors ${
                  dark
                    ? 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                    : 'border-line text-ink/60 hover:bg-ink hover:text-white hover:border-ink'
                }`}
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={direction === -1 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
                  />
                </svg>
              </button>
            ))}
          </div>
        </Reveal>

        {status === 'loading' && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`shrink-0 w-[46%] sm:w-[31%] lg:w-[19%] aspect-[3/4] animate-pulse ${
                  dark ? 'bg-white/10' : 'bg-concrete'
                }`}
              />
            ))}
          </div>
        )}

        {status === 'error' && (
          <p className={`text-sm ${dark ? 'text-white/50' : 'text-gray-400'}`}>
            {t('products.loadError')}
          </p>
        )}

        {status === 'ready' && products.length === 0 && (
          <p className={`text-sm ${dark ? 'text-white/50' : 'text-gray-400'}`}>{t('rail.empty')}</p>
        )}

        {status === 'ready' && products.length > 0 && (
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:-mx-10 md:px-10"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="shrink-0 w-[46%] sm:w-[31%] lg:w-[19%] snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
