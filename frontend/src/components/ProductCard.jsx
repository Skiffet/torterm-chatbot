export default function ProductCard({ product }) {
  const price = product.price ? `${Number(product.price).toLocaleString()} Baht` : 'N/A'

  return (
    <div className="flex-shrink-0 w-52 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="flex gap-3 p-3">
        {/* Product image */}
        <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentNode.classList.add('flex', 'items-center', 'justify-center')
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 mb-1">
            {product.name}
          </p>
          <p className="text-[11px] text-gray-400">Brand: {product.brand || '—'}</p>
          <p className="text-xs font-bold text-primary mt-1">{price}</p>
        </div>
      </div>

      <button className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-medium py-2 transition-colors">
        Add to Cart
      </button>
    </div>
  )
}
