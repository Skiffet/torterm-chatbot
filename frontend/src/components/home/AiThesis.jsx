import { useEffect, useRef } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { usePrefersReducedMotion } from '../../lib/hooks'
import SpecTag from '../ui/SpecTag'
import Reveal from '../ui/Reveal'

/** The part of the page that argues for the product rather than the catalogue.
 *
 * The photograph carries a slow parallax and the spec tags land on it as it
 * scrolls, which is the same gesture as the hero — a house, then the materials
 * that house is made of, priced.
 */
export default function AiThesis() {
  const { t } = useLanguage()
  const { heroSpecs, status } = useCatalog()
  const reducedMotion = usePrefersReducedMotion()
  const frameRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) return undefined
    const frame = frameRef.current
    const image = imageRef.current
    if (!frame || !image) return undefined

    let ticking = false
    const update = () => {
      const rect = frame.getBoundingClientRect()
      // -1 well below the viewport, 1 well above it.
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
      image.style.transform = `translate3d(0, ${(progress * -28).toFixed(2)}px, 0) scale(1.12)`
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reducedMotion])

  const steps = t('thesis.steps')

  return (
    <section id="how-it-works" className="bg-ink text-white overflow-hidden">
      <div className="max-w-page mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
                {t('thesis.eyebrow')}
              </p>
              <h2 className="text-display mt-3 text-3xl md:text-[2.75rem] font-semibold">
                {t('thesis.title')}
              </h2>
              <p className="mt-5 text-white/60 text-base md:text-lg leading-relaxed max-w-lg">
                {t('thesis.description')}
              </p>
            </Reveal>

            {/* Numbered because this genuinely is a sequence — each step only
                makes sense after the one before it. */}
            <ol className="mt-10 divide-y divide-white/10 border-t border-white/10">
              {steps.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 90} className="py-5 flex gap-5">
                  <span className="font-mono text-sm text-signal tabular-nums pt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-medium text-white">{step.title}</h3>
                    <p className="mt-1.5 text-sm text-white/55 leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal delay={120}>
            <div ref={frameRef} className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] overflow-hidden">
              {/* A still from the hero footage, not house-overview-full.jpg:
                  that photo has its caption baked into the pixels, so any crop
                  slices the lettering mid-word. Reusing the frame also means
                  this is visibly the same house the hero was moving over —
                  now with its materials named. */}
              <img
                ref={imageRef}
                src="/video/hero-mobile-poster.jpg"
                alt={t('thesis.imageAlt')}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                style={{ transform: 'scale(1.12)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-ink/25" />

              {status === 'ready' && heroSpecs[1] && (
                <div className="absolute left-5 top-6 sm:left-7">
                  <SpecTag
                    surface={t(`hero.surfaces.${heroSpecs[1].key}`)}
                    product={heroSpecs[1].product}
                  />
                </div>
              )}
              {status === 'ready' && heroSpecs[3] && (
                <div className="absolute right-5 bottom-8 sm:right-7">
                  <SpecTag
                    surface={t(`hero.surfaces.${heroSpecs[3].key}`)}
                    product={heroSpecs[3].product}
                    delay={200}
                  />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
