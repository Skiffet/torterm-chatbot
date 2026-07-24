import { useLanguage } from '../i18n/LanguageContext'

export default function HowItWorks() {
  const { t } = useLanguage()
  const steps = t('howItWorks.steps')

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-2xl mb-10 md:mb-14">
        <span className="text-primary font-semibold text-sm uppercase tracking-wide">{t('howItWorks.eyebrow')}</span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mt-2">
          {t('howItWorks.title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {steps.map((s, i) => (
          <div key={s.title}>
            <div className="text-5xl font-extrabold text-blue-100 mb-3">{String(i + 1).padStart(2, '0')}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-gray-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
