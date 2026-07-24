import { useLanguage } from '../i18n/LanguageContext'

const CATEGORIES = [
  { image: '/images/painting.jpg', key: 'paint', groupId: 'paint' },
  { image: '/images/door.png', key: 'door', groupId: 'door-window' },
  { image: '/images/backyard.png', key: 'garden', groupId: 'garden-outdoor' },
  { image: '/images/roofing-gutter.png', key: 'roof', groupId: 'roof-structure' },
  { image: '/images/patio.png', key: 'patio', groupId: 'garden-outdoor' },
]

export default function CategoryGrid({ onSelectGroup }) {
  const { t } = useLanguage()

  const handleClick = (groupId) => {
    onSelectGroup?.(groupId)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="categories" className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-2xl mb-10 md:mb-14">
        <span className="text-primary font-semibold text-sm uppercase tracking-wide">
          {t('categoryGrid.eyebrow')}
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mt-2">
          {t('categoryGrid.title')}
        </h2>
        <p className="text-gray-500 mt-3 text-base md:text-lg">
          {t('categoryGrid.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => handleClick(c.groupId)}
            className="group text-left rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="h-36 overflow-hidden">
              <img
                src={c.image}
                alt={t(`categoryGrid.cards.${c.key}.title`)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{t(`categoryGrid.cards.${c.key}.title`)}</h3>
              <p className="text-sm text-gray-500 leading-snug">{t(`categoryGrid.cards.${c.key}.desc`)}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
