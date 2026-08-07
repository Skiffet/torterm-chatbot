// Pure selectors over the product catalogue. Nothing here fetches or holds
// state — CatalogContext owns that — so each function can be unit-tested and,
// once a real API exists, reused unchanged against its response.
import { CATEGORY_GROUPS, groupIdForCategory } from '../data/categoryGroups'

/** Products whose `originalPrice` represents a believable markdown.
 *
 * The scrape mixes units: some rows carry a per-pallet `originalPrice` against
 * a per-piece `price` (อิฐแดง ONGROUND lists ฿2 against ฿7,370, a "-100%"
 * discount that is really a unit mismatch). Anything outside 5–70% is treated
 * as a data artefact rather than a deal.
 */
export function discountPercent(product) {
  const { price, originalPrice } = product
  if (price == null || originalPrice == null || originalPrice <= price) return null
  const pct = Math.round(((originalPrice - price) / originalPrice) * 100)
  return pct >= 5 && pct <= 70 ? pct : null
}

/** Stable pseudo-random ordering keyed off product id.
 *
 * Curated rails need to look hand-picked and stay put across reloads. Real
 * popularity data would replace this outright. */
function stableRank(id, salt) {
  let hash = 2166136261
  const key = `${salt}:${id}`
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967295
}

export function countsByGroup(products) {
  const counts = Object.fromEntries(CATEGORY_GROUPS.map((g) => [g.id, 0]))
  for (const p of products) {
    const groupId = groupIdForCategory(p.category)
    if (groupId) counts[groupId] += 1
  }
  return counts
}

export function productsInGroup(products, groupId) {
  if (groupId === 'all') return products
  return products.filter((p) => groupIdForCategory(p.category) === groupId)
}

/** Real markdowns, deepest first. */
export function selectDeals(products, limit = 12) {
  return products
    .map((p) => ({ product: p, pct: discountPercent(p) }))
    .filter((row) => row.pct !== null && row.product.image)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, limit)
    .map((row) => row.product)
}

/** One product per shopping group, so the rail spans the whole catalogue
 *  instead of stacking up in whichever category happens to be largest. */
export function selectRecommended(products, limit = 12) {
  const byGroup = new Map()
  for (const p of products) {
    if (!p.image || p.price == null) continue
    const groupId = groupIdForCategory(p.category)
    if (!groupId) continue
    if (!byGroup.has(groupId)) byGroup.set(groupId, [])
    byGroup.get(groupId).push(p)
  }

  for (const list of byGroup.values()) {
    list.sort((a, b) => stableRank(a.id, 'rec') - stableRank(b.id, 'rec'))
  }

  const picked = []
  const groupIds = [...byGroup.keys()]
  let round = 0
  while (picked.length < limit) {
    const before = picked.length
    for (const groupId of groupIds) {
      const list = byGroup.get(groupId)
      if (round < list.length && picked.length < limit) picked.push(list[round])
    }
    if (picked.length === before) break
    round += 1
  }
  return picked
}

/** Brands ranked by how much of the catalogue they carry. */
export function selectTopBrands(products, limit = 8) {
  const counts = new Map()
  for (const p of products) {
    if (!p.brand) continue
    counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([brand, count]) => ({ brand, count }))
}

/** Cheapest in-stock item per category — the "where do I start" rail. */
export function selectEntryPrice(products, limit = 12) {
  const cheapestPerCategory = new Map()
  for (const p of products) {
    if (p.price == null || !p.image) continue
    const current = cheapestPerCategory.get(p.category)
    if (!current || p.price < current.price) cheapestPerCategory.set(p.category, p)
  }
  return [...cheapestPerCategory.values()].sort((a, b) => a.price - b.price).slice(0, limit)
}

/** Materials pinned to surfaces in the hero video.
 *
 * Each entry names a part of a house and resolves to a real catalogue row, so
 * the hero shows the actual product and price rather than sample copy. */
const HERO_SURFACES = [
  { key: 'roof', category: 'กระเบื้องหลังคาคอนกรีต' },
  { key: 'wall', category: 'สีน้ำทาภายนอก' },
  { key: 'door', category: 'ประตูอลูมิเนียม' },
  { key: 'floor', category: 'กระเบื้องพื้นภายนอก' },
]

export function selectHeroSpecs(products) {
  return HERO_SURFACES.map(({ key, category }) => {
    const candidates = products
      .filter((p) => p.category === category && p.price != null && p.image)
      .sort((a, b) => stableRank(a.id, 'hero') - stableRank(b.id, 'hero'))
    return candidates.length ? { key, category, product: candidates[0] } : null
  }).filter(Boolean)
}

export function searchProducts(products, query, limit = 24) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const scored = []
  for (const p of products) {
    const name = p.name.toLowerCase()
    const brand = (p.brand ?? '').toLowerCase()
    const category = p.category.toLowerCase()
    let score = 0
    if (name.startsWith(q)) score = 4
    else if (name.includes(q)) score = 3
    else if (brand.includes(q)) score = 2
    else if (category.includes(q)) score = 1
    if (score) scored.push({ p, score })
    if (scored.length > 400) break
  }
  return scored
    .sort((a, b) => b.score - a.score || a.p.name.length - b.p.name.length)
    .slice(0, limit)
    .map((row) => row.p)
}

/** Distinct category names inside a group, with a representative image. */
export function categoriesInGroup(products, groupId) {
  const group = CATEGORY_GROUPS.find((g) => g.id === groupId)
  if (!group) return []
  return group.categories
    .map((category) => {
      const items = products.filter((p) => p.category === category)
      return items.length ? { category, count: items.length, sample: items[0] } : null
    })
    .filter(Boolean)
}
