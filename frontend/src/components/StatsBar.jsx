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
    <section id="stats" className="bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STAT_VALUES.map((s) => (
            <div key={s.key}>
              <div className="text-3xl md:text-4xl font-extrabold text-white">{s.value}</div>
              <div className="text-blue-100 text-sm md:text-base mt-1">{t(`stats.${s.key}`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
