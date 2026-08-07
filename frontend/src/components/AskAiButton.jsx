import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

/** Floating entry point to the assistant.
 *
 * The mascot is kept — it is the product's character — but framed inside a
 * proper control instead of floating loose at 96px, which read as a sticker
 * dropped on the page. The label stays collapsed over the hero, where it would
 * compete with the headline, and opens once the page is into its content.
 */
export default function AskAiButton() {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const onScroll = () => setExpanded(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label={t('askAi.ariaLabel')}
      className="group fixed bottom-4 right-4 md:bottom-5 md:right-5 z-30 flex items-center gap-2 bg-ink text-white p-1.5 md:p-2 shadow-xl shadow-ink/30 transition-colors duration-300 hover:bg-primary"
    >
      {/* Kept small on phones — it floats over whatever is bottom-right, and
          at 44px it was covering a figure in the strip under the hero. */}
      <span className="w-9 h-9 md:w-11 md:h-11 shrink-0 bg-white/10 overflow-hidden">
        <img
          src="/images/mascot-icon.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain transition-transform duration-500 ease-cinematic group-hover:scale-110"
        />
      </span>
      <span
        className={`hidden sm:block overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-500 ease-cinematic ${
          expanded ? 'max-w-[12rem] opacity-100 pr-2' : 'max-w-0 opacity-0'
        }`}
      >
        {t('askAi.label')}
      </span>
    </button>
  )
}
