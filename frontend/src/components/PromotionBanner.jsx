import { useLanguage } from '../i18n/LanguageContext'

export default function PromotionBanner() {
  const { t } = useLanguage()

  return (
    <section className="max-w-4xl mx-auto px-6 md:px-10 pb-10 md:pb-14">
      <div className="rounded-3xl overflow-hidden shadow-sm">
        <img
          src="/images/promotion-banner.jpg"
          alt={t('promotion.alt')}
          className="w-full h-auto block"
        />
      </div>
    </section>
  )
}
