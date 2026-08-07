import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

const STAT_VALUES = [
  { value: '903+', key: 'productsInCatalog' },
  { value: '40', key: 'subCategories' },
  { value: '88', key: 'topBrands' },
  { value: 'AI', key: 'aiAnalyze' },
]

export default function StatsBar() {
  const { t } = useLanguage()

  return (
    <section id="stats" className="relative bg-ink-900 overflow-hidden">
      <div className="absolute inset-0 bg-grid-fade [background-size:56px_56px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STAT_VALUES.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-safety">{s.value}</div>
              <div className="text-white/55 text-sm md:text-base mt-1.5">{t(`stats.${s.key}`)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
