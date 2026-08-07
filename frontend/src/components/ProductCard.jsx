import { useLanguage } from '../i18n/LanguageContext'
import Icon from './wholesale/Icon'

export default function ProductCard({ product }) {
  const { t } = useLanguage()
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const formatPrice = (value) =>
    value != null ? `฿${value.toLocaleString('th-TH')}` : t('products.contactForPrice')

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col bg-white border border-steel-200 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-ink-900/10 hover:-translate-y-1 transition-all duration-300"
    >
      {hasDiscount && (
        <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-extrabold px-2 py-1 rounded-full bg-safety text-ink">
          -{discountPct}%
        </span>
      )}

      <div className="aspect-square bg-steel-50 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-steel-300 text-xs">
            {t('products.noImage')}
          </div>
        )}
      </div>

      <div className="p-3.5 flex-1 flex flex-col gap-1">
        <p className="text-[11px] font-semibold text-primary uppercase tracking-wide">
          {product.brand || '—'}
        </p>
        <p className="text-sm font-semibold text-ink-900 leading-snug line-clamp-2 flex-1">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-base font-extrabold text-ink-900">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-steel-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-steel-400 group-hover:text-primary transition-colors">
          ดูรายละเอียด
          <Icon
            name="arrow"
            className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
            strokeWidth={2.5}
          />
        </span>
      </div>
    </a>
  )
}
