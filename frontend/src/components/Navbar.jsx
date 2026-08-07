import { useEffect, useState } from 'react'
import { CATEGORY_GROUPS } from '../data/categoryGroups'
import { useCatalog } from '../context/CatalogContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { useLanguage } from '../i18n/LanguageContext'
import { formatCount } from '../lib/format'

function Logo({ className = '' }) {
  return (
    <span className={`w-8 h-8 bg-signal flex items-center justify-center ${className}`}>
      <svg className="w-5 h-5 text-ink" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M4 20c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2H4v2z" />
      </svg>
    </span>
  )
}

export default function Navbar({ onSelectGroup }) {
  const { lang, setLang, t } = useLanguage()
  const { groupCounts } = useCatalog()
  const { itemCount } = useCart()
  const { user } = useAuth()
  const { openAuth, openCart, openSearch, openMenu } = useUI()
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)

  // The bar starts transparent over the hero footage and picks up a surface
  // once the page moves, so the hero is never framed by a white slab.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleGroup = (groupId) => {
    setMegaOpen(false)
    onSelectGroup?.(groupId)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  const solid = scrolled || megaOpen

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${
        solid ? 'bg-white/95 backdrop-blur-md border-b border-line' : 'bg-transparent'
      }`}
    >
      <div className="max-w-page mx-auto px-6 md:px-10 h-16 md:h-[4.5rem] flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <Logo />
          <span
            className={`font-semibold text-lg tracking-tight transition-colors ${
              solid ? 'text-ink' : 'text-white'
            }`}
          >
            Torterm
          </span>
        </a>

        <nav
          className={`hidden lg:flex items-center gap-7 text-sm transition-colors ${
            solid ? 'text-ink/70' : 'text-white/80'
          }`}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <button
            type="button"
            onMouseEnter={() => setMegaOpen(true)}
            onClick={() => setMegaOpen((open) => !open)}
            aria-expanded={megaOpen}
            className="flex items-center gap-1.5 hover:text-signal transition-colors py-2"
          >
            {t('nav.categories')}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <a href="#products" className="hover:text-signal transition-colors">{t('nav.products')}</a>
          <a href="#how-it-works" className="hover:text-signal transition-colors">{t('nav.howItWorks')}</a>
          <a href="#why" className="hover:text-signal transition-colors">{t('nav.about')}</a>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div
            className={`hidden sm:flex items-center text-[11px] font-medium mr-1 border ${
              solid ? 'border-line' : 'border-white/25'
            }`}
          >
            {['th', 'en'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-2.5 py-1.5 transition-colors ${
                  lang === code
                    ? 'bg-signal text-ink'
                    : solid
                      ? 'text-ink/50 hover:text-ink'
                      : 'text-white/60 hover:text-white'
                }`}
              >
                {code === 'th' ? 'ไทย' : 'EN'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={openSearch}
            aria-label={t('nav.search')}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${
              solid ? 'text-ink/70 hover:text-ink' : 'text-white/80 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
            </svg>
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={t('nav.cart')}
            className={`relative w-10 h-10 flex items-center justify-center transition-colors ${
              solid ? 'text-ink/70 hover:text-ink' : 'text-white/80 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12z" />
              <path strokeLinecap="round" d="M6 6L5 3H3" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[1.1rem] h-[1.1rem] px-1 bg-signal text-ink font-mono text-[10px] font-semibold flex items-center justify-center tabular-nums">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => openAuth('login')}
            className={`hidden sm:block text-sm font-medium px-4 py-2.5 transition-colors ${
              solid
                ? 'bg-ink text-white hover:bg-primary'
                : 'border border-white/30 text-white hover:bg-white/10'
            }`}
          >
            {user ? user.name : t('nav.login')}
          </button>

          <button
            type="button"
            onClick={openMenu}
            aria-label={t('nav.menu')}
            className={`lg:hidden w-10 h-10 flex items-center justify-center transition-colors ${
              solid ? 'text-ink' : 'text-white'
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mega menu — the five shopping groups with the real subcategories
          underneath each, so the breadth of the catalogue is visible before
          committing to a click. */}
      <div
        onMouseLeave={() => setMegaOpen(false)}
        className={`hidden lg:block absolute inset-x-0 top-full bg-white border-b border-line overflow-hidden transition-all duration-300 ease-cinematic ${
          megaOpen ? 'max-h-[26rem] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-page mx-auto px-10 py-8 grid grid-cols-5 gap-6">
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => handleGroup(group.id)}
                className="text-left group/head"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-400 tabular-nums">
                  {formatCount(groupCounts[group.id] ?? 0)}
                </span>
                <h3 className="mt-1 font-semibold text-ink text-sm group-hover/head:text-primary transition-colors">
                  {t(group.labelKey)}
                </h3>
              </button>
              <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                {group.categories.slice(0, 6).map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => handleGroup(group.id)}
                      className="text-[13px] text-gray-500 hover:text-primary transition-colors text-left"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
