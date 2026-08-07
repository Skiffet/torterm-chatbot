import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { CATEGORY_GROUPS, groupIdForCategory } from '../data/categoryGroups'
import { useLanguage } from '../i18n/LanguageContext'

const PAGE_SIZE = 20

export default function ProductsSection({ activeGroup, onChangeGroup }) {
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    fetch('/data/products.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setProducts(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  const filtered = useMemo(() => {
    if (activeGroup === 'all') return products
    return products.filter((p) => groupIdForCategory(p.category) === activeGroup)
  }, [products, activeGroup])

  // Reset pagination whenever the active group changes, whether triggered by
  // the pills below or by clicking a category card up in CategoryGrid.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [activeGroup])

  const visible = filtered.slice(0, visibleCount)

  const pillClass = (active) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-all ${
      active
        ? 'bg-ink-900 text-white shadow-lg shadow-ink-900/20'
        : 'bg-white text-steel-500 border border-steel-200 hover:border-steel-300 hover:text-ink-900'
    }`

  return (
    <section id="products" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-8"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-[0.18em]">
            {t('products.eyebrow')}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-ink-900 mt-3 leading-tight">
            {t('products.title')}
          </h2>
          <p className="text-steel-500 mt-4 text-base md:text-lg leading-relaxed">
            {t('products.description')}
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => onChangeGroup('all')} className={pillClass(activeGroup === 'all')}>
            {t('categoryFilters.all')}
          </button>
          {CATEGORY_GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => onChangeGroup(g.id)}
              className={pillClass(activeGroup === g.id)}
            >
              {t(g.labelKey)}
            </button>
          ))}
        </div>

        {status === 'loading' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-steel-200 overflow-hidden">
                <div className="aspect-square bg-steel-100 animate-pulse" />
                <div className="p-3.5 space-y-2">
                  <div className="h-2.5 w-14 bg-steel-100 rounded-full animate-pulse" />
                  <div className="h-3 w-full bg-steel-100 rounded-full animate-pulse" />
                  <div className="h-3 w-2/3 bg-steel-100 rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-steel-100 rounded-full animate-pulse mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {status === 'error' && (
          <p className="text-steel-400 text-sm">{t('products.loadError')}</p>
        )}

        {status === 'ready' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <p className="text-center text-steel-400 text-sm mt-8">
              {t('products.showingCount')(visible.length, filtered.length)}
            </p>

            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-7 py-3 rounded-full bg-ink-900 text-white font-semibold hover:bg-ink-800 transition-colors"
                >
                  {t('products.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
