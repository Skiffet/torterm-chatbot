export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg leading-none">T</span>
          </div>
          <span className="font-bold text-primary text-xl tracking-tight">Torterm</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg relative mx-4">
          <input
            type="text"
            placeholder="Search materials, roofing, exterior paints..."
            className="w-full pl-4 pr-11 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary transition-colors bg-gray-50"
          />
          <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Cart */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              1
            </span>
          </button>

          {/* Bell */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Avatar */}
          <button className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors ml-1">
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
