import { useCart } from '../context/CartContext'
import { useLanguage } from '../i18n/LanguageContext'
import { discountPercent } from '../lib/catalog'
import { formatBaht } from '../lib/format'

export default function ProductCard({ product }) {
  const { t } = useLanguage()
  const { add } = useCart()
  const pct = discountPercent(product)
  const price = formatBaht(product.price)

  return (
    /* A wrapper rather than a single <a>: the card links out to the product
       page, but "add to basket" is an action on this page, and a button may
       not be nested inside an anchor. */
    /* h-full so a one-line product name does not leave its "add" button
       floating above the neighbouring cards in a rail or grid row. */
    <div className="group relative flex flex-col h-full bg-white border border-line/70 transition-colors duration-300 hover:border-ink/30">
      <a
        href={product.url}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col flex-1"
        aria-label={product.name}
      >
        <div className="relative aspect-square bg-concrete/60 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-contain p-4 transition-transform duration-700 ease-cinematic group-hover:scale-[1.05]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
              {t('products.noImage')}
            </div>
          )}

          {pct !== null && (
            <span className="absolute top-0 left-0 bg-signal text-ink font-mono text-[11px] font-semibold px-2 py-1">
              −{pct}%
            </span>
          )}
        </div>

        <div className="p-3.5 flex-1 flex flex-col gap-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gray-400">
            {product.brand || '—'}
          </p>
          <p className="text-[13px] text-ink leading-snug line-clamp-2 flex-1">{product.name}</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            {/* The mono face carries figures only — the no-price fallback is
                Thai, which it cannot set. */}
            {price ? (
              <span className="font-mono text-[15px] font-medium text-ink tabular-nums">
                {price}
              </span>
            ) : (
              <span className="text-sm text-gray-500">{t('products.contactForPrice')}</span>
            )}
            {pct !== null && (
              <span className="font-mono text-[11px] text-gray-400 line-through tabular-nums">
                {formatBaht(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </a>

      <button
        type="button"
        onClick={() => add(product)}
        disabled={product.price == null}
        className="border-t border-line/70 py-2.5 text-xs font-medium text-ink/70 transition-colors hover:bg-ink hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink/70"
      >
        {product.price == null ? t('products.contactForPrice') : t('products.addToCart')}
      </button>
    </div>
  )
}
