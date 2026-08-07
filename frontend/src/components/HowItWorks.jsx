import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export default function HowItWorks() {
  const { t } = useLanguage()
  const steps = t('howItWorks.steps')

  return (
    <section id="how-it-works" className="bg-steel-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-10 md:mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-[0.18em]">
            {t('howItWorks.eyebrow')}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-ink-900 mt-3 leading-tight">
            {t('howItWorks.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl bg-white border border-steel-200 p-7 hover:shadow-xl hover:shadow-ink-900/10 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-safety text-ink text-lg font-extrabold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-xl font-bold text-ink-900 mt-5 mb-2">{s.title}</h3>
              <p className="text-steel-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
