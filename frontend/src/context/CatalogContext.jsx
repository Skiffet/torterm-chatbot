import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../api/products'
import {
  countsByGroup,
  selectDeals,
  selectEntryPrice,
  selectHeroSpecs,
  selectRecommended,
  selectTopBrands,
} from '../lib/catalog'

const CatalogContext = createContext(null)

/** Loads the catalogue once for the whole page.
 *
 * Before this existed ProductsSection fetched products.json on its own; every
 * new rail would have refetched the same 392KB. The derived rails are memoised
 * off the loaded array so adding a section costs a pass over it, not a
 * request. */
export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false
    fetchProducts()
      .then((data) => {
        if (cancelled) return
        setProducts(data)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => {
    const ready = status === 'ready'
    return {
      products,
      status,
      categoryCount: ready ? new Set(products.map((p) => p.category)).size : 0,
      brandCount: ready ? new Set(products.filter((p) => p.brand).map((p) => p.brand)).size : 0,
      groupCounts: ready ? countsByGroup(products) : {},
      deals: ready ? selectDeals(products, 12) : [],
      recommended: ready ? selectRecommended(products, 12) : [],
      entryPrice: ready ? selectEntryPrice(products, 12) : [],
      topBrands: ready ? selectTopBrands(products, 10) : [],
      heroSpecs: ready ? selectHeroSpecs(products) : [],
    }
  }, [products, status])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within a CatalogProvider')
  return ctx
}
