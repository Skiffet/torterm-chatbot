import { useCatalog } from '../../context/CatalogContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { formatCount } from '../../lib/format'

/** The numbers directly under the hero, counted from the catalogue itself
 *  rather than typed in — if the data grows, this grows with it. */
export default function TrustStrip() {
  const { t } = useLanguage()
  const { products, categoryCount, brandCount, status } = useCatalog()
  const ready = status === 'ready'

  const figures = [
    { value: ready ? formatCount(products.length) : '—', label: t('trust.products') },
    { value: ready ? formatCount(categoryCount) : '—', label: t('trust.categories') },
    { value: ready ? formatCount(brandCount) : '—', label: t('trust.brands') },
  ]

  return (
    <section className="bg-ink border-t border-white/10">
      <div className="max-w-page mx-auto px-6 md:px-10">
        <div className="grid grid-cols-3 divide-x divide-white/10">
          {figures.map((figure) => (
            <div
              key={figure.label}
              className="py-5 md:py-7 px-2 md:px-8 text-center md:text-left first:md:pl-0"
            >
              <div className="font-mono text-xl md:text-3xl text-white tabular-nums">
                {figure.value}
              </div>
              {/* Wraps to two lines on a narrow phone rather than clipping. */}
              <div className="mt-1 text-[10px] md:text-sm text-white/50 leading-tight md:leading-snug">
                {figure.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
