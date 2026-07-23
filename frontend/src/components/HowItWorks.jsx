const STEPS = [
  {
    n: '01',
    title: 'อัปโหลดรูปบ้าน',
    desc: 'ถ่ายหรืออัปโหลดรูปบ้านของคุณ พร้อมบอกสิ่งที่อยากปรับปรุง',
  },
  {
    n: '02',
    title: 'AI วิเคราะห์ & แนะนำ',
    desc: 'Torterm ค้นหาวัสดุที่เหมาะสมจากแคตตาล็อกจริง พร้อมประเมินราคา',
  },
  {
    n: '03',
    title: 'เห็นภาพก่อนตัดสินใจ',
    desc: 'ดูรูปบ้านเวอร์ชันปรับปรุงแล้ว พร้อมรายการวัสดุที่ใช้ได้จริง',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-2xl mb-10 md:mb-14">
        <span className="text-primary font-semibold text-sm uppercase tracking-wide">วิธีใช้งาน</span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mt-2">
          ง่ายแค่ 3 ขั้นตอน
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {STEPS.map((s) => (
          <div key={s.n}>
            <div className="text-5xl font-extrabold text-blue-100 mb-3">{s.n}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-gray-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
