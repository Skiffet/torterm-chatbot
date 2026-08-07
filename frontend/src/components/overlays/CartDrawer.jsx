import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { formatBaht } from '../../lib/format'

export default function CartDrawer() {
  const { t } = useLanguage()
  const { overlay, close, openAuth } = useUI()
  const { lines, itemCount, subtotal, remove, setQuantity } = useCart()

  if (overlay !== 'cart') return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label={t('common.close')}
        onClick={close}
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="relative w-full max-w-md bg-white flex flex-col"
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div>
            <h2 id="cart-title" className="text-lg font-semibold text-ink">
              {t('cart.title')}
            </h2>
            <p className="text-xs text-gray-400 tabular-nums mt-0.5">
              {t('cart.itemCount')(itemCount)}
            </p>
          </div>
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

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <span className="w-14 h-14 border border-line flex items-center justify-center text-gray-300">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12z" />
                <path strokeLinecap="round" d="M6 6L5 3H3" />
              </svg>
            </span>
            <p className="mt-5 font-medium text-ink">{t('cart.emptyTitle')}</p>
            <p className="mt-1.5 text-sm text-gray-500">{t('cart.emptyBody')}</p>
            <button
              type="button"
              onClick={() => {
                close()
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="mt-6 bg-ink text-white text-sm font-medium px-6 py-3 hover:bg-primary transition-colors"
            >
              {t('cart.emptyAction')}
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y divide-line">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 p-5">
                  <div className="w-20 h-20 shrink-0 bg-concrete/60">
                    {line.image && (
                      <img
                        src={line.image}
                        alt=""
                        className="w-full h-full object-contain p-1.5"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-gray-400">
                      {line.brand || '—'}
                    </p>
                    <p className="text-[13px] text-ink leading-snug line-clamp-2 mt-0.5">
                      {line.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          aria-label={t('cart.decrease')}
                          className="w-8 h-8 text-ink/60 hover:bg-concrete transition-colors"
                        >
                          −
                        </button>
                        <span className="w-9 text-center font-mono text-sm tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          aria-label={t('cart.increase')}
                          className="w-8 h-8 text-ink/60 hover:bg-concrete transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-sm font-medium text-ink tabular-nums">
                        {formatBaht((line.price ?? 0) * line.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.id)}
                    aria-label={t('cart.remove')}
                    className="self-start text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line p-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-500">{t('cart.subtotal')}</span>
                <span className="font-mono text-xl font-medium text-ink tabular-nums">
                  {formatBaht(subtotal)}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{t('cart.shippingNote')}</p>
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="w-full bg-signal text-ink font-semibold py-3.5 hover:bg-[#ffb84d] transition-colors"
              >
                {t('cart.checkout')}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
