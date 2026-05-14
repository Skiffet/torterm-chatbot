import ProductCard from './ProductCard'

export default function RenovationCard({ originalImage, renovatedImage, products }) {
  const hasImages = originalImage || renovatedImage
  const hasProducts = products?.length > 0

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      {/* Before / After comparison */}
      {hasImages && (
        <div className="grid grid-cols-2">
          {/* Original */}
          <div className="p-3 border-r border-gray-100">
            <p className="text-[11px] font-medium text-gray-400 text-center uppercase tracking-wide mb-2">
              Original House
            </p>
            {originalImage ? (
              <img
                src={originalImage}
                alt="Original house"
                className="w-full h-40 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 rounded-xl" />
            )}
          </div>

          {/* AI Renovated */}
          <div className="bg-primary p-3">
            <p className="text-[11px] font-medium text-white/80 text-center uppercase tracking-wide mb-2">
              AI Renovated Design
            </p>
            {renovatedImage ? (
              <img
                src={renovatedImage}
                alt="AI renovated design"
                className="w-full h-40 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-40 bg-primary-dark rounded-xl flex items-center justify-center">
                <p className="text-white/40 text-xs text-center px-4">
                  AI renovation image unavailable
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products */}
      {hasProducts && (
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            List of Materials Used in Design
          </h3>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {products.map((product, i) => (
              <ProductCard key={product.url || i} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
