import { useEffect, useRef, useState } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { useUI } from '../../context/UIContext'
import { useMediaQuery, usePrefersReducedMotion } from '../../lib/hooks'
import SpecTag from '../ui/SpecTag'

export default function HeroCinematic() {
  const { t } = useLanguage()
  const { heroSpecs, status } = useCatalog()
  const { openAuth } = useUI()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const reducedMotion = usePrefersReducedMotion()
  const videoRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)

  // Portrait and landscape are separate shots, not one shot cropped — the
  // vertical cut tilts up the facade so the architecture still reads on a
  // phone. Only the matching pair is ever requested.
  const variant = isMobile ? 'hero-mobile' : 'hero-desktop'
  const source = `/video/${variant}.mp4`
  const poster = `/video/${variant}-poster.jpg`

  // Swapping `src` on an already-playing <video> needs an explicit load().
  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion) return
    setVideoReady(false)
    video.load()
  }, [source, reducedMotion])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <section id="top" className="relative min-h-[92svh] md:min-h-[88vh] flex flex-col bg-ink">
      {/* Footage layer */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoReady && !reducedMotion ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {!reducedMotion && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setVideoReady(true)}
          >
            <source src={source} type="video/mp4" />
          </video>
        )}

        {/* A single scrim per breakpoint, with explicit stops. Two stacked
            Tailwind gradients multiplied into near-black and buried the
            architecture the shot exists to show. Copy sits over the dense end;
            the rest stays light enough to read as footage. */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              // Light through the top third so the roofline reads, then dense
              // from where the copy starts — the sunlit tiles sit exactly
              // where the eyebrow and headline land.
              'linear-gradient(180deg, rgba(14,20,32,0.55) 0%, rgba(14,20,32,0.08) 18%, rgba(14,20,32,0.30) 31%, rgba(14,20,32,0.82) 44%, rgba(14,20,32,0.94) 62%, rgba(14,20,32,0.98) 100%)',
          }}
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              'linear-gradient(97deg, rgba(14,20,32,0.95) 0%, rgba(14,20,32,0.82) 26%, rgba(14,20,32,0.42) 50%, rgba(14,20,32,0.16) 72%, rgba(14,20,32,0.08) 100%)',
          }}
        />
      </div>

      {/* Copy layer */}
      <div className="relative flex-1 flex items-end md:items-center">
        <div className="w-full max-w-page mx-auto px-6 md:px-10 pb-10 md:pb-0 pt-28 md:pt-24">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 lg:col-span-6">
              <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.22em] text-signal animate-tag-in">
                {t('hero.eyebrow')}
              </p>

              <h1
                className="text-display mt-4 md:mt-5 text-white font-semibold text-[2.1rem] leading-[1.2] sm:text-5xl lg:text-[3.65rem] animate-tag-in"
                style={{ animationDelay: '90ms' }}
              >
                {t('hero.titleLine1')}
                <br />
                <span className="text-white/60">{t('hero.titleLine2')}</span>
              </h1>

              <p
                className="mt-5 text-white/70 text-[15px] md:text-lg leading-relaxed max-w-md animate-tag-in"
                style={{ animationDelay: '180ms' }}
              >
                {t('hero.description')}
              </p>

              {/* Side by side even on a phone: both labels are short, and
                  stacking them cost enough height to squeeze the footage out
                  of the frame entirely. */}
              <div
                className="mt-7 md:mt-8 flex flex-row gap-3 animate-tag-in"
                style={{ animationDelay: '270ms' }}
              >
                <button
                  type="button"
                  onClick={() => scrollTo('categories')}
                  className="flex-1 sm:flex-none bg-signal text-ink font-semibold px-5 sm:px-7 py-3.5 hover:bg-[#ffb84d] transition-colors duration-200"
                >
                  {t('hero.ctaPrimary')}
                </button>
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="flex-1 sm:flex-none border border-white/30 text-white font-medium px-5 sm:px-7 py-3.5 hover:bg-white/10 hover:border-white/50 transition-colors duration-200"
                >
                  {t('hero.ctaSecondary')}
                </button>
              </div>
            </div>

            {/* Spec tags — desktop only. They need room to sit apart from each
                other and from the copy; stacked on a phone they would cover
                the very footage they annotate. */}
            <div className="hidden md:block md:col-span-5 lg:col-span-6">
              <div className="relative h-[22rem]">
                {status === 'ready' &&
                  heroSpecs.slice(0, 3).map((spec, i) => (
                    <SpecTag
                      key={spec.product.id}
                      surface={t(`hero.surfaces.${spec.key}`)}
                      product={spec.product}
                      delay={600 + i * 220}
                      className={
                        [
                          'absolute top-0 right-4 lg:right-16',
                          'absolute top-[8.5rem] right-32 lg:right-56',
                          'absolute top-[17rem] right-0 lg:right-8',
                        ][i]
                      }
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* One tag on mobile, below the copy — enough to explain the idea
              without burying the shot. */}
          {status === 'ready' && heroSpecs[0] && (
            <div className="md:hidden mt-8">
              <SpecTag
                surface={t(`hero.surfaces.${heroSpecs[0].key}`)}
                product={heroSpecs[0].product}
                delay={500}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
