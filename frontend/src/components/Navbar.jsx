import { useLanguage } from '../i18n/LanguageContext'

export default function Navbar() {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M4 20c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2H4v2z" />
            </svg>
          </span>
          <span className="font-extrabold text-lg tracking-tight text-gray-900">Torterm</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#categories" className="hover:text-primary transition-colors">{t('nav.categories')}</a>
          <a href="#products" className="hover:text-primary transition-colors">{t('nav.products')}</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">{t('nav.howItWorks')}</a>
          <a href="#stats" className="hover:text-primary transition-colors">{t('nav.about')}</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-full p-1 text-xs font-semibold">
            <button
              onClick={() => setLang('th')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                lang === 'th' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ไทย
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                lang === 'en' ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              EN
            </button>
          </div>

          <a
            href="#cta"
            className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
          >
            {t('nav.cta')}
          </a>
        </div>
      </div>
    </header>
  )
}
