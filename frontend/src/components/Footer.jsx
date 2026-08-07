import { CATEGORY_GROUPS } from '../data/categoryGroups'
import { useLanguage } from '../i18n/LanguageContext'

export default function Footer({ onSelectGroup }) {
  const { t } = useLanguage()

  const goToGroup = (groupId) => {
    onSelectGroup?.(groupId)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-ink text-white/70">
      <div className="max-w-page mx-auto px-6 md:px-10 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 bg-signal flex items-center justify-center">
                <svg className="w-5 h-5 text-ink" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2M7 14v2h2v-2H7m8 0v2h2v-2h-2M4 20c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2H4v2z" />
                </svg>
              </span>
              <span className="font-semibold text-lg text-white">Torterm</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">{t('footer.blurb')}</p>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              {t('footer.shop')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORY_GROUPS.map((group) => (
                <li key={group.id}>
                  <button
                    type="button"
                    onClick={() => goToGroup(group.id)}
                    className="hover:text-signal transition-colors text-left"
                  >
                    {t(group.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              {t('footer.help')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {t('footer.helpLinks').map((label) => (
                <li key={label} className="text-white/50">
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
              {t('footer.contact')}
            </h3>
            <p className="mt-4 font-mono text-sm text-white">02-000-0000</p>
            <p className="mt-1 text-sm">{t('footer.hours')}</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Torterm — {t('footer.tagline')}
          </p>
          {/* The catalogue is scraped from HomePro and product links still
              resolve there, so the page says as much instead of implying the
              stock is ours. */}
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
            {t('footer.dataNote')}
          </p>
        </div>
      </div>
    </footer>
  )
}
