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
          {/* Isometric stacked-material mark. The top face is the only plane
              that has to change with the bar: cream reads on the dark hero but
              vanishes on white, so it steps down to a light steel once the bar
              turns solid. Amber and navy carry the shape in both states. */}
          <svg viewBox="0 0 64 64" className="w-9 h-9 shrink-0" aria-hidden="true">
            <path d="M32 5 8 25 32 39Z" fill="#E8912A" />
            <path
              d="M32 5 56 25 32 39Z"
              className="transition-colors"
              fill={scrolled ? '#CBD5E1' : '#F4F1EA'}
            />
            <path d="M11 27.5 32 39.7 32 55 11 42.8Z" fill="#12305C" />
            <path d="M53 27.5 53 42.8 32 55 32 39.7Z" fill="#1B3E6E" />
          </svg>
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
