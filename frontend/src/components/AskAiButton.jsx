export default function AskAiButton() {
  return (
    <button
      type="button"
      aria-label="ถามข้อมูลสินค้ากับ Torterm AI (เร็วๆ นี้)"
      className="fixed bottom-5 right-5 z-50 w-24 h-24 md:w-28 md:h-28 drop-shadow-xl hover:scale-105 active:scale-95 transition-transform"
    >
      <img
        src="/images/mascot-icon.png"
        alt="ถามข้อมูลสินค้า"
        className="w-full h-full object-contain"
      />
    </button>
  )
}
