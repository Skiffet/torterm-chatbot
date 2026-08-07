import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

/** In-memory basket.
 *
 * Lines are keyed by product id and hold a snapshot of name/price/image, which
 * is what a real cart endpoint returns too — the basket has to survive a
 * catalogue price change without silently repricing what the shopper saw. */
export function CartProvider({ children }) {
  const [lines, setLines] = useState([])

  const add = useCallback((product, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.id === product.id)
      if (existing) {
        return current.map((line) =>
          line.id === product.id ? { ...line, quantity: line.quantity + quantity } : line,
        )
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          quantity,
        },
      ]
    })
  }, [])

  const remove = useCallback((id) => {
    setLines((current) => current.filter((line) => line.id !== id))
  }, [])

  const setQuantity = useCallback((id, quantity) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) => (line.id === id ? { ...line, quantity } : line)),
    )
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo(() => {
    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
    const subtotal = lines.reduce((sum, line) => sum + (line.price ?? 0) * line.quantity, 0)
    return { lines, itemCount, subtotal, add, remove, setQuantity, clear }
  }, [lines, add, remove, setQuantity, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
