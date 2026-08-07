import { useLanguage } from '../../i18n/LanguageContext'
import { useUI } from '../../context/UIContext'
import Reveal from '../ui/Reveal'

export default function FinalCTA() {
  const { t } = useLanguage()
  const { openAuth } = useUI()

  return (
    <section id="cta" className="relative overflow-hidden bg-ink">
      <img
        src="/images/patio.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

      <div className="relative max-w-page mx-auto px-6 md:px-10 py-20 md:py-28">
        <Reveal className="max-w-xl">
          <h2 className="text-display text-3xl md:text-[2.75rem] font-semibold text-white">
            {t('finalCta.title')}
          </h2>
          <p className="mt-4 text-white/60 text-base md:text-lg leading-relaxed">
            {t('finalCta.description')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() =>
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-signal text-ink font-semibold px-7 py-3.5 hover:bg-[#ffb84d] transition-colors"
            >
              {t('finalCta.primary')}
            </button>
            <button
              type="button"
              onClick={() => openAuth('register')}
              className="border border-white/30 text-white font-medium px-7 py-3.5 hover:bg-white/10 hover:border-white/50 transition-colors"
            >
              {t('finalCta.secondary')}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
