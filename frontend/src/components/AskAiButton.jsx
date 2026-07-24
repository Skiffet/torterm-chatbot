import { useLanguage } from '../i18n/LanguageContext'

export default function AskAiButton() {
  const { t } = useLanguage()

  return (
    <button
      type="button"
      aria-label={t('askAi.ariaLabel')}
      className="fixed bottom-5 right-5 z-50 w-24 h-24 md:w-28 md:h-28 drop-shadow-xl hover:scale-105 active:scale-95 transition-transform"
    >
      <img
        src="/images/mascot-icon.png"
        alt={t('askAi.alt')}
        className="w-full h-full object-contain"
      />
    </button>
  )
}
