import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'
import Reveal from './ui/Reveal'
import { CATEGORY_GROUPS } from '../data/categoryGroups'
import { useCatalog } from '../context/CatalogContext'
import { useLanguage } from '../i18n/LanguageContext'
import { productsInGroup } from '../lib/catalog'

const PAGE_SIZE = 20

export default function ProductsSection({ activeGroup, onChangeGroup }) {
  const { t } = useLanguage()
  // The catalogue is loaded once by CatalogProvider and shared with the rails
  // above; this section used to fetch products.json a second time on its own.
  const { products, status } = useCatalog()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(
    () => productsInGroup(products, activeGroup),
    [products, activeGroup],
  )

  // Reset pagination whenever the active group changes, whether triggered by
  // the pills below or by a category card further up the page.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [activeGroup])

  const visible = filtered.slice(0, visibleCount)

  return (
    <section id="products" className="max-w-page mx-auto px-6 md:px-10 py-20 md:py-24">
      <Reveal className="max-w-2xl mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          FULL CATALOGUE
        </p>
        <h2 className="text-display mt-3 text-3xl md:text-[2.75rem] font-semibold text-ink">
          {t('products.title')}
        </h2>
        <p className="mt-4 text-gray-500 text-base md:text-lg">{t('products.description')}</p>
      </Reveal>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => onChangeGroup('all')}
          className={`px-4 py-2 text-sm font-medium border transition-colors ${
            activeGroup === 'all'
              ? 'bg-ink text-white border-ink'
              : 'bg-white text-ink/60 border-line hover:border-ink hover:text-ink'
          }`}
        >
          {t('categoryFilters.all')}
        </button>
        {CATEGORY_GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => onChangeGroup(g.id)}
            className={`px-4 py-2 text-sm font-medium border transition-colors ${
              activeGroup === g.id
                ? 'bg-ink text-white border-ink'
                : 'bg-white text-ink/60 border-line hover:border-ink hover:text-ink'
            }`}
          >
            {t(g.labelKey)}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-concrete animate-pulse" />
          ))}
        </div>
      )}

      {status === 'error' && <p className="text-gray-400 text-sm">{t('products.loadError')}</p>}

      {status === 'ready' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-8 tabular-nums">
            {t('products.showingCount')(visible.length, filtered.length)}
          </p>

          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-7 py-3 border border-line text-ink font-medium hover:bg-ink hover:text-white hover:border-ink transition-colors"
              >
                {t('products.loadMore')}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
