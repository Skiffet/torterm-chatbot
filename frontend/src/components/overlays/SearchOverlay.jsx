import { useEffect, useMemo, useRef, useState } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import { useUI } from '../../context/UIContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { searchProducts } from '../../lib/catalog'
import { formatBaht } from '../../lib/format'

const SUGGESTIONS = ['กระเบื้องหลังคา', 'ประตูอลูมิเนียม', 'สีทาภายนอก', 'หญ้าเทียม', 'อิฐมวลเบา']

export default function SearchOverlay() {
  const { t } = useLanguage()
  const { overlay, close } = useUI()
  const { products, status } = useCatalog()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  const open = overlay === 'search'

  useEffect(() => {
    if (!open) return undefined
    const timer = setTimeout(() => inputRef.current?.focus(), 60)
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const results = useMemo(
    () => (status === 'ready' ? searchProducts(products, query, 24) : []),
    [products, query, status],
  )

  if (!open) return null

  const trimmed = query.trim()

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t('common.close')}
        onClick={close}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.search')}
        className="relative bg-white max-h-[85vh] flex flex-col"
      >
        <div className="max-w-page mx-auto w-full px-6 md:px-10 py-5 flex items-center gap-4 border-b border-line">
          <svg className="w-5 h-5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 text-lg md:text-xl text-ink outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={close}
            aria-label={t('common.close')}
            className="text-sm text-gray-400 hover:text-ink transition-colors shrink-0"
          >
            {t('common.close')}
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="max-w-page mx-auto w-full px-6 md:px-10 py-6">
            {!trimmed && (
              <div>
                <p className="text-xs font-medium text-gray-400">{t('search.suggestions')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="border border-line px-3.5 py-2 text-sm text-ink/70 hover:border-ink hover:text-ink transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {trimmed && results.length === 0 && (
              <div className="py-12 text-center">
                <p className="font-medium text-ink">{t('search.emptyTitle')(trimmed)}</p>
                <p className="mt-1.5 text-sm text-gray-500">{t('search.emptyBody')}</p>
              </div>
            )}

            {trimmed && results.length > 0 && (
              <>
                <p className="text-xs font-medium text-gray-400 tabular-nums">
                  {t('search.resultCount')(results.length)}
                </p>
                <ul className="mt-3 divide-y divide-line">
                  {results.map((product) => (
                    <li key={product.id}>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 py-3 group"
                      >
                        <div className="w-14 h-14 shrink-0 bg-concrete/60">
                          {product.image && (
                            <img
                              src={product.image}
                              alt=""
                              loading="lazy"
                              className="w-full h-full object-contain p-1"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-gray-400">{product.category}</p>
                          <p className="text-sm text-ink line-clamp-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </p>
                        </div>
                        <span className="font-mono text-sm text-ink tabular-nums shrink-0">
                          {formatBaht(product.price) ?? '—'}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
