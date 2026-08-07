import { formatBaht } from '../../lib/format'

/** A material tag pinned to a surface in the hero footage.
 *
 * This is the page's signature device: it takes a real catalogue row and
 * presents it the way a spec tag reads on site — surface it belongs to, what
 * the material is, what it costs. The mono face and the hairline rules are
 * doing the work; there is no fill and no shadow beyond what keeps it legible
 * over moving video.
 */
export default function SpecTag({ surface, product, className = '', delay = 0 }) {
  const price = formatBaht(product.price)

  return (
    <figure
      className={`w-[13.5rem] animate-tag-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Pin + leader line: the tag reads as attached to the surface behind it. */}
      <div className="flex items-center gap-0 pl-1">
        <span className="w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
        <span className="h-px flex-1 bg-signal/60" />
      </div>

      <div className="mt-1.5 border border-white/25 bg-ink/70 backdrop-blur-md px-3 py-2.5">
        {/* Sans, not the mono face used elsewhere for labels: this one holds
            Thai (หลังคา, ผนัง), which Plex Mono does not cover. */}
        <figcaption className="text-[11px] font-medium tracking-[0.04em] text-signal">
          {surface}
        </figcaption>
        <p className="mt-1 text-[13px] leading-snug text-white/90 line-clamp-2">{product.name}</p>
        {price && (
          <p className="mt-1.5 font-mono text-sm font-medium text-white tabular-nums">{price}</p>
        )}
      </div>
    </figure>
  )
}
