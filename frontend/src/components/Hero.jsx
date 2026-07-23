const THUMBS = [
  { src: '/images/backyard.png', alt: 'สวนและภูมิทัศน์', label: 'สวน & ภูมิทัศน์' },
  { src: '/images/door.png', alt: 'ประตูและระบบรักษาความปลอดภัย', label: 'ประตู & Smart Lock' },
  { src: '/images/patio.png', alt: 'พื้นที่นั่งเล่นกลางแจ้ง', label: 'พื้นที่นั่งเล่น' },
  { src: '/images/roofing-gutter.png', alt: 'หลังคาและรางน้ำ', label: 'หลังคา & รางน้ำ' },
]

export default function Hero() {
  return (
    <section id="top" className="max-w-7xl mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
        {/* Text card */}
        <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-white p-8 md:p-10 flex flex-col justify-center gap-5 order-1">
          <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold uppercase tracking-wide bg-white/15 px-3 py-1 rounded-full">
            ✨ ขับเคลื่อนด้วย AI
          </span>
          <h1 className="text-3xl md:text-[2.6rem] font-extrabold leading-tight">
            เปลี่ยนบ้านคุณ
            <br />
            ให้เป็นบ้านในฝัน
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-md">
            อัปโหลดรูปบ้าน บอกสิ่งที่อยากปรับปรุง แล้วให้ Torterm AI
            แนะนำวัสดุจริงจากแคตตาล็อกกว่า 900 รายการ พร้อมประเมินราคาให้ทันที
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="#cta"
              className="bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
            >
              เริ่มออกแบบบ้าน
            </a>
            <a
              href="#categories"
              className="border border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              ดูหมวดหมู่สินค้า
            </a>
          </div>
        </div>

        {/* Big feature image */}
        <div className="md:col-span-2 order-2 relative rounded-3xl overflow-hidden group">
          <img
            src="/images/house-overview.jpg"
            alt="บ้านหลังปรับปรุง พร้อมโซลาร์เซลล์ สวน และพื้นที่นั่งเล่นกลางแจ้ง"
            className="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          <span className="absolute bottom-4 left-5 text-white font-semibold text-lg drop-shadow">
            บ้านที่ปรับปรุงแล้วสมบูรณ์แบบ
          </span>
        </div>

        {/* Thumbnail strip */}
        {THUMBS.map((t) => (
          <div key={t.src} className="order-3 relative rounded-2xl overflow-hidden h-40 md:h-48 group">
            <img
              src={t.src}
              alt={t.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
            <span className="absolute bottom-3 left-3 right-3 text-white text-xs md:text-sm font-medium drop-shadow">
              {t.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
