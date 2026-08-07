export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-safety flex items-center justify-center">
            <svg className="w-[18px] h-[18px] text-ink" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M4 20c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2H4v2z" />
            </svg>
          </span>
          <span className="font-extrabold text-white text-lg">Torterm</span>
        </div>

        <p className="text-sm text-white/40 text-center md:text-right">
          © {new Date().getFullYear()} Torterm — ศูนย์รวมวัสดุก่อสร้างและผู้ช่วย AI
        </p>
      </div>
    </footer>
  )
}
