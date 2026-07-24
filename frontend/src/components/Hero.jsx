import { useLanguage } from '../i18n/LanguageContext'

const THUMB_IMAGES = [
  { src: '/images/backyard.png', key: 'garden' },
  { src: '/images/door.png', key: 'door' },
  { src: '/images/patio.png', key: 'patio' },
  { src: '/images/roofing-gutter.png', key: 'roof' },
]

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section id="top" className="max-w-7xl mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
        {/* Text card */}
        <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-white p-6 flex flex-col justify-center gap-2 order-1">
          <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide bg-white/15 px-3 py-1 rounded-full">
            {t('hero.badge')}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            {t('hero.titleLine1')}
            <br />
            {t('hero.titleLine2')}
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-md">
            {t('hero.description')}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="#cta"
              className="bg-white text-primary font-semibold px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
            >
              {t('hero.ctaPrimary')}
            </a>
            <a
              href="#categories"
              className="border border-white/40 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors"
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </div>

        {/* Big feature image — full image, uncropped (caption is baked into the photo itself).
            Container aspect ratio matches the photo's exactly (1600x938), so it fills the
            box edge-to-edge with zero cropping and zero leftover gap — no floating look. */}
        <div className="md:col-span-2 order-2 md:self-center rounded-3xl overflow-hidden aspect-[1600/938]">
          <img
            src="/images/house-overview-full.jpg"
            alt={t('hero.heroImageAlt')}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnail strip */}
        {THUMB_IMAGES.map((thumb) => (
          <div key={thumb.src} className="order-3 relative rounded-2xl overflow-hidden h-40 md:h-48 group">
            <img
              src={thumb.src}
              alt={t(`hero.thumbs.${thumb.key}.alt`)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
            <span className="absolute bottom-3 left-3 right-3 text-white text-xs md:text-sm font-medium drop-shadow">
              {t(`hero.thumbs.${thumb.key}.label`)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
