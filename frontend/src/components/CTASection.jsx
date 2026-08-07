import { useLanguage } from '../i18n/LanguageContext'
import Icon from './wholesale/Icon'
import { useAuth } from '../store/AuthContext'

export default function CTASection() {
  const { t } = useLanguage()
  const { openAuth } = useAuth()

  return (
    <section id="cta" className="bg-white pb-20 md:pb-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="relative rounded-[2rem] overflow-hidden">
          <img
            src="/images/patio.png"
            alt={t('cta.imageAlt')}
            className="w-full h-80 md:h-[26rem] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/85 to-ink-900/25" />

          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-14 max-w-lg">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                {t('cta.title')}
              </h2>
              <p className="text-steel-300 mb-7 leading-relaxed">{t('cta.description')}</p>
              <button
                onClick={openAuth}
                className="group inline-flex items-center gap-2 bg-safety hover:bg-safety-dark text-ink font-bold px-7 py-3.5 rounded-full transition-colors shadow-xl shadow-safety/20"
              >
                {t('cta.button')}
                <Icon
                  name="arrow"
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  strokeWidth={2.4}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
