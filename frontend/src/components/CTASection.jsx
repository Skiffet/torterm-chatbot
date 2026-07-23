export default function CTASection() {
  return (
    <section id="cta" className="max-w-7xl mx-auto px-6 md:px-10 pb-20 md:pb-28">
      <div className="relative rounded-3xl overflow-hidden">
        <img
          src="/images/patio.png"
          alt="พื้นที่นั่งเล่นกลางแจ้งหลังปรับปรุง"
          className="w-full h-72 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-14 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              พร้อมเปลี่ยนบ้านของคุณหรือยัง?
            </h2>
            <p className="text-blue-100 mb-6">
              เริ่มคุยกับ Torterm AI วันนี้ ไม่มีค่าใช้จ่ายในการเริ่มต้น
            </p>
            <button className="bg-white text-primary font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-lg">
              เริ่มคุยกับ Torterm AI
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
