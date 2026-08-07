import { CATEGORY_GROUPS } from '../../data/categoryGroups'
import { useAuth } from '../../context/AuthContext'
import { useCatalog } from '../../context/CatalogContext'
import { useUI } from '../../context/UIContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { formatCount } from '../../lib/format'

/** Full-height navigation for phones and tablets.
 *
 * Built as its own surface rather than a collapsed copy of the desktop bar:
 * the groups get room to show their counts, and the account actions sit at the
 * bottom within thumb reach.
 */
export default function MobileMenu({ onSelectGroup }) {
  const { lang, setLang, t } = useLanguage()
  const { overlay, close, openAuth } = useUI()
  const { groupCounts } = useCatalog()
  const { user, logout } = useAuth()

  if (overlay !== 'menu') return null

  const goToGroup = (groupId) => {
    close()
    onSelectGroup?.(groupId)
    setTimeout(
      () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }),
      80,
    )
  }

  const goToSection = (id) => {
    close()
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label={t('common.close')}
        onClick={close}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu')}
        className="relative ml-auto w-full max-w-sm h-full bg-white flex flex-col"
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-line">
          <span className="font-semibold text-lg text-ink">Torterm</span>
          <button
            type="button"
            onClick={close}
            aria-label={t('common.close')}
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-ink transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <nav className="flex-1 overflow-y-auto">
          <p className="px-6 pt-6 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-400">
            {t('nav.categories')}
          </p>
          <ul className="border-t border-line">
            {CATEGORY_GROUPS.map((group) => (
              <li key={group.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => goToGroup(group.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-concrete/50 transition-colors"
                >
                  <span className="text-ink">{t(group.labelKey)}</span>
                  <span className="font-mono text-xs text-gray-400 tabular-nums">
                    {formatCount(groupCounts[group.id] ?? 0)}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <ul className="mt-2">
            {[
              { id: 'products', label: t('nav.products') },
              { id: 'how-it-works', label: t('nav.howItWorks') },
              { id: 'why', label: t('nav.about') },
            ].map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => goToSection(link.id)}
                  className="w-full px-6 py-3.5 text-left text-ink hover:bg-concrete/50 transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="border-t border-line p-6 space-y-4">
          <div className="flex items-center border border-line w-fit text-xs font-medium">
            {['th', 'en'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-3.5 py-2 transition-colors ${
                  lang === code ? 'bg-signal text-ink' : 'text-ink/50'
                }`}
              >
                {code === 'th' ? 'ไทย' : 'EN'}
              </button>
            ))}
          </div>

          {user ? (
            <div className="space-y-2">
              <p className="text-sm text-ink">{t('auth.signedInAs')(user.name)}</p>
              <button
                type="button"
                onClick={async () => {
                  await logout()
                  close()
                }}
                className="w-full border border-line py-3 text-sm text-ink hover:bg-concrete transition-colors"
              >
                {t('auth.logout')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="bg-ink text-white text-sm font-medium py-3 hover:bg-primary transition-colors"
              >
                {t('nav.login')}
              </button>
              <button
                type="button"
                onClick={() => openAuth('register')}
                className="border border-line text-ink text-sm font-medium py-3 hover:bg-concrete transition-colors"
              >
                {t('auth.registerAction')}
              </button>
            </div>
          )}
        </footer>
      </aside>
    </div>
  )
}
