import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'
import { CATEGORY_GROUPS, groupIdForCategory } from '../data/categoryGroups'

const PAGE_SIZE = 20

export default function ProductsSection({ activeGroup, onChangeGroup }) {
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

  return (
    <section id="products" className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-2xl mb-8">
        <span className="text-primary font-semibold text-sm uppercase tracking-wide">สินค้าทั้งหมด</span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mt-2">เลือกซื้อวัสดุจริงจากแคตตาล็อก</h2>
        <p className="text-gray-500 mt-3 text-base md:text-lg">
          สินค้า 903 รายการ จาก 40 หมวดหมู่ย่อย กรองตามกลุ่มที่ต้องการได้เลย
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => onChangeGroup('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeGroup === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ทั้งหมด
        </button>
        {CATEGORY_GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => onChangeGroup(g.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeGroup === g.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <p className="text-gray-400 text-sm">โหลดสินค้าไม่สำเร็จ ลองรีเฟรชหน้าใหม่อีกครั้ง</p>
      )}

      {status === 'ready' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            แสดง {visible.length} จาก {filtered.length} รายการ
          </p>

          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                ดูเพิ่มเติม
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
