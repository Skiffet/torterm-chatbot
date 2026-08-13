const SHOP_LINKS = [
  { label: 'Doors & Windows', groupId: 'door-window' },
  { label: 'Floor & Wall', groupId: 'floor-wall' },
  { label: 'Roofing & Structure', groupId: 'roof-structure' },
  { label: 'Garden & Outdoor', groupId: 'garden-outdoor' },
  { label: 'Paint & Supplies', groupId: 'paint' },
]

// Until the policy pages exist, these point at the closest section that already
// answers the question. Swap the hrefs for real routes when those pages land.
const HELP_LINKS = [
  { label: 'How to Order', href: '#how-it-works' },
  { label: 'Delivery', href: '#how-it-works' },
  { label: 'Returns', href: '#how-it-works' },
  { label: 'Contact Us', href: '#footer-contact' },
]

function ColumnHeading({ children }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
      {children}
    </h3>
  )
}

export default function Footer({ onSelectGroup }) {
  // Footer shop links double as catalogue filters: set the active group, then
  // send the page back up to the product grid.
  const openGroup = (groupId) => {
    onSelectGroup?.(groupId)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-ink border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="max-w-xs">
            <span className="font-bold text-white text-xl tracking-tight">Torterm</span>
            <p className="mt-5 text-sm text-white/50 leading-relaxed">
              An assistant for choosing exterior renovation materials, from a real product
              catalogue with live prices.
            </p>
          </div>

          <div>
            <ColumnHeading>Shop</ColumnHeading>
            <ul className="mt-6 space-y-4">
              {SHOP_LINKS.map((link) => (
                <li key={link.groupId + link.label}>
                  <button
                    onClick={() => openGroup(link.groupId)}
                    className="text-sm text-white/70 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnHeading>Help</ColumnHeading>
            <ul className="mt-6 space-y-4">
              {HELP_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div id="footer-contact">
            <ColumnHeading>Contact</ColumnHeading>
            <div className="mt-6 space-y-2">
              <a
                href="tel:020000000"
                className="block font-mono text-base text-white tracking-wide hover:text-safety transition-colors"
              >
                02-000-0000
              </a>
              <p className="text-sm text-white/50">Mon–Sat, 9:00–18:00</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Torterm — Construction materials and AI assistant
          </p>
        </div>
      </div>
    </footer>
  )
}
