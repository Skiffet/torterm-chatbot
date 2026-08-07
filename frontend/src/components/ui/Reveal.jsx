import { useEffect, useRef } from 'react'

/** Reveals its children once they scroll into view.
 *
 * An IntersectionObserver rather than a scroll listener, and it unobserves
 * after firing — the reveal is a one-way entrance, not something that replays
 * every time the section passes the fold. The motion itself is CSS
 * (`[data-reveal]` in index.css), which is also where reduced-motion turns it
 * into an instant show.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      node.dataset.revealed = 'true'
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.dataset.revealed = 'true'
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-revealed="false"
      style={{ '--reveal-delay': `${delay}ms` }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}
