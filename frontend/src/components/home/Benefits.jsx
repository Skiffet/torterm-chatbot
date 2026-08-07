import { useLanguage } from '../../i18n/LanguageContext'
import Reveal from '../ui/Reveal'

/** Set as a spec sheet rather than a row of icon cards — hairline cells and a
 *  mono label per claim, matching the tag device used through the page. */
export default function Benefits() {
  const { t } = useLanguage()
  const items = t('benefits.items')

  return (
    <section id="why" className="max-w-page mx-auto px-6 md:px-10 py-20 md:py-28">
      <Reveal className="max-w-2xl mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          {t('benefits.eyebrow')}
        </p>
        <h2 className="text-display mt-3 text-3xl md:text-[2.75rem] font-semibold text-ink">
          {t('benefits.title')}
        </h2>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-line">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 80} className="border-b border-r border-line p-6 md:p-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-400">
              {item.label}
            </span>
            <h3 className="mt-3 text-lg font-semibold text-ink leading-snug">{item.title}</h3>
            <p className="mt-2.5 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
