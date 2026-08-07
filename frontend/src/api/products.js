// Catalogue access. Today this reads the scraped JSON that already ships in
// /public; later it becomes `fetch('/api/products/')` against Django. The
// resolved shape is the same either way, so CatalogContext and every selector
// in lib/catalog.js are unaffected by the swap.
import { ApiError } from './client'

let cache = null

export async function fetchProducts() {
  if (cache) return cache
  const res = await fetch('/data/products.json')
  if (!res.ok) {
    throw new ApiError('catalog_unavailable', `HTTP ${res.status}`)
  }
  cache = await res.json()
  return cache
}
