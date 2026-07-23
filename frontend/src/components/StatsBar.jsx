const STATS = [
  { value: '903+', label: 'สินค้าในแคตตาล็อก' },
  { value: '40', label: 'หมวดหมู่ย่อย' },
  { value: '88', label: 'แบรนด์ชั้นนำ' },
  { value: 'AI', label: 'วิเคราะห์ & แนะนำอัตโนมัติ' },
]

export default function StatsBar() {
  return (
    <section id="stats" className="bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-extrabold text-white">{s.value}</div>
              <div className="text-blue-100 text-sm md:text-base mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
