export default function Footer() {
  return (
    <footer className="border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M4 20c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2H4v2z" />
            </svg>
          </span>
          <span className="font-bold text-gray-900">Torterm</span>
        </div>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Torterm — AI Home Exterior Renovation
        </p>
      </div>
    </footer>
  )
}
