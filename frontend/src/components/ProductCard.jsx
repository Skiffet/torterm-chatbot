function formatPrice(value) {
  return value != null ? `${value.toLocaleString('th-TH')} ฿` : 'สอบถามราคา'
}

export default function ProductCard({ product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            ไม่มีรูปภาพ
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col gap-1">
        <p className="text-[11px] text-gray-400">{product.brand || '—'}</p>
        <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 flex-1">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </a>
  )
}
