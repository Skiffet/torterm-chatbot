import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import Icon from './wholesale/Icon'
import { useAuth } from '../store/AuthContext'

export default function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const { isLoggedIn, user, openAuth } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  // Transparent over the hero, solid once the page moves past it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = scrolled
    ? 'text-steel-500 hover:text-primary'
    : 'text-white/70 hover:text-white'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-steel-200 shadow-sm'
          : 'bg-gradient-to-b from-ink/60 to-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <span
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              scrolled ? 'bg-primary' : 'bg-safety'
            }`}
          >
            <svg
              className={`w-5 h-5 ${scrolled ? 'text-white' : 'text-ink'}`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M4 20c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2H4v2z" />
            </svg>
          </span>
          <span
            className={`font-extrabold text-lg tracking-tight transition-colors ${
              scrolled ? 'text-ink-900' : 'text-white'
            }`}
          >
            Torterm
          </span>
        </a>

        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors ${linkClass}`}>
          <a href="#categories" className="transition-colors">{t('nav.categories')}</a>
          <a href="#products" className="transition-colors">{t('nav.products')}</a>
          <a href="#how-it-works" className="transition-colors">{t('nav.howItWorks')}</a>
          <a href="#stats" className="transition-colors">{t('nav.about')}</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <div
            className={`hidden sm:flex items-center rounded-full p-1 text-xs font-semibold transition-colors ${
              scrolled ? 'bg-steel-100' : 'bg-white/10 backdrop-blur-md'
            }`}
          >
            {['th', 'en'].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  lang === code
                    ? scrolled
                      ? 'bg-primary text-white'
                      : 'bg-safety text-ink'
                    : scrolled
                      ? 'text-steel-500 hover:text-ink-900'
                      : 'text-white/60 hover:text-white'
                }`}
              >
                {code === 'th' ? 'ไทย' : 'EN'}
              </button>
            ))}
          </div>

          <button
            onClick={openAuth}
            className={`inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-colors ${
              scrolled
                ? 'bg-primary hover:bg-primary-dark text-white'
                : 'bg-safety hover:bg-safety-dark text-ink'
            }`}
          >
            <Icon name="user" className="w-4 h-4" strokeWidth={2.2} />
            <span className="hidden sm:inline">
              {isLoggedIn ? user.name : t('nav.cta')}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
