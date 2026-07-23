const CATEGORIES = [
  {
    image: '/images/solarcell.png',
    title: 'พลังงานแสงอาทิตย์',
    desc: 'แผงโซลาร์เซลล์ อินเวอร์เตอร์ แบตเตอรี่กักเก็บพลังงาน',
  },
  {
    image: '/images/door.png',
    title: 'ประตู & Smart Lock',
    desc: 'ประตูอลูมิเนียม UPVC กลอนดิจิทัล กริ่งกล้อง',
  },
  {
    image: '/images/backyard.png',
    title: 'สวน & ภูมิทัศน์',
    desc: 'ทางเดินหิน รั้ว หญ้าเทียม ไฟส่องสวน',
  },
  {
    image: '/images/roofing-gutter.png',
    title: 'หลังคา & รางน้ำ',
    desc: 'กระเบื้องหลังคา รางน้ำฝน กันสาด ฉนวนกันความร้อน',
  },
  {
    image: '/images/patio.png',
    title: 'พื้นที่นั่งเล่นกลางแจ้ง',
    desc: 'เฟอร์นิเจอร์นอกบ้าน กล้องวงจรปิด ไฟและของแต่งสวน',
  },
]

export default function CategoryGrid() {
  return (
    <section id="categories" className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-2xl mb-10 md:mb-14">
        <span className="text-primary font-semibold text-sm uppercase tracking-wide">หมวดหมู่สินค้า</span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mt-2">
          ครอบคลุมทุกส่วนของบ้านภายนอก
        </h2>
        <p className="text-gray-500 mt-3 text-base md:text-lg">
          รวมวัสดุและอุปกรณ์ปรับปรุงบ้านกว่า 900 รายการ จาก 40 หมวดหมู่ย่อย
          พร้อมให้ AI แนะนำตามความต้องการของคุณ
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {CATEGORIES.map((c) => (
          <div
            key={c.title}
            className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="h-36 overflow-hidden">
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
              <p className="text-sm text-gray-500 leading-snug">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
