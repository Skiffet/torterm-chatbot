import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import Icon from './wholesale/Icon'

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
    <section id="categories" className="bg-steel-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-10 md:mb-14"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-[0.18em]">
            {t('categoryGrid.eyebrow')}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-ink-900 mt-3 leading-tight">
            {t('categoryGrid.title')}
          </h2>
          <p className="text-steel-500 mt-4 text-base md:text-lg leading-relaxed">
            {t('categoryGrid.description')}
          </p>
        </motion.div>

        {/* First card runs double-width on desktop so the grid reads as an
            editorial layout rather than five identical tiles. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {CATEGORIES.map((c, i) => (
            <motion.button
              key={c.key}
              onClick={() => handleClick(c.groupId)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative text-left rounded-3xl overflow-hidden bg-ink-900 shadow-sm hover:shadow-2xl hover:shadow-ink-900/20 transition-all duration-500 hover:-translate-y-1 ${
                i === 0 ? 'lg:col-span-2 lg:row-span-1' : ''
              }`}
            >
              <div className={`overflow-hidden ${i === 0 ? 'h-64 md:h-80' : 'h-56 md:h-64'}`}>
                <img
                  src={c.image}
                  alt={t(`categoryGrid.cards.${c.key}.title`)}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/45 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <h3 className="font-bold text-white text-lg md:text-xl leading-snug">
                  {t(`categoryGrid.cards.${c.key}.title`)}
                </h3>
                <p className="text-sm text-white/60 leading-snug mt-1.5 max-w-md">
                  {t(`categoryGrid.cards.${c.key}.desc`)}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-safety">
                  เลือกดูสินค้า
                  <Icon
                    name="arrow"
                    className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                    strokeWidth={2.5}
                  />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
