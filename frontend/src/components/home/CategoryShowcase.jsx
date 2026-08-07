import { CATEGORY_GROUPS } from '../../data/categoryGroups'
import { useCatalog } from '../../context/CatalogContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { formatCount } from '../../lib/format'
import Reveal from '../ui/Reveal'

/** One image per shopping group.
 *
 * The old grid had five cards but pointed two of them at `garden-outdoor`,
 * which left `floor-wall` — every tile, stone and cladding product — with no
 * way in from the home page. Each group appears exactly once here.
 */
const GROUP_MEDIA = [
  { id: 'roof-structure', image: '/images/roofing-gutter.webp', span: 'lg:col-span-2 lg:row-span-2' },
  { id: 'door-window', image: '/images/door.webp' },
  // painting.webp is cropped below the promo headline baked into the source
  // JPEG, so the card carries one title instead of two competing ones.
  { id: 'paint', image: '/images/painting.webp' },
  { id: 'floor-wall', image: '/images/patio.webp' },
  { id: 'garden-outdoor', image: '/images/backyard.webp' },
]

const labelKeyFor = (groupId) =>
  CATEGORY_GROUPS.find((g) => g.id === groupId)?.labelKey ?? 'categoryFilters.all'

export default function CategoryShowcase({ onSelectGroup }) {
  const { t } = useLanguage()
  const { groupCounts, status } = useCatalog()

  const handleSelect = (groupId) => {
    onSelectGroup?.(groupId)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="categories" className="max-w-page mx-auto px-6 md:px-10 py-20 md:py-28">
      <Reveal className="max-w-2xl mb-10 md:mb-14">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          {t('categories.eyebrow')}
        </p>
        <h2 className="text-display mt-3 text-3xl md:text-[2.75rem] font-semibold text-ink">
          {t('categories.title')}
        </h2>
        <p className="mt-4 text-gray-500 text-base md:text-lg leading-relaxed">
          {t('categories.description')}
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:auto-rows-[13.5rem]">
        {GROUP_MEDIA.map((group, i) => {
          const count = groupCounts[group.id] ?? 0
          const isFeature = Boolean(group.span)

          return (
            <Reveal
              key={group.id}
              delay={i * 70}
              className={`${group.span ?? ''} ${isFeature ? 'sm:col-span-2' : ''}`}
            >
              <button
                type="button"
                onClick={() => handleSelect(group.id)}
                className="group relative w-full h-56 lg:h-full overflow-hidden text-left bg-ink"
              >
                <img
                  src={group.image}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 w-full h-full object-cover ${group.position ?? ''} opacity-80 transition-transform duration-[900ms] ease-cinematic group-hover:scale-[1.06] group-hover:opacity-90`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

                <div className="relative h-full flex flex-col justify-end p-5">
                  <span className="text-[11px] font-medium tracking-[0.04em] text-signal tabular-nums">
                    {status === 'ready' ? `${formatCount(count)} ${t('categories.itemsUnit')}` : '—'}
                  </span>
                  <h3
                    className={`mt-1.5 font-semibold text-white ${
                      isFeature ? 'text-2xl lg:text-[1.75rem]' : 'text-lg'
                    }`}
                  >
                    {t(labelKeyFor(group.id))}
                  </h3>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors group-hover:text-white">
                    {t('categories.browse')}
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </button>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
