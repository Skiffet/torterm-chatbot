// Hotspots pinned to /images/interior-living.jpg. Each one points at a real
// SKU from public/data/products.json — product names stay in Thai because
// that is the scraped catalogue text and is never translated (same rule as
// categoryGroups.js). Only the surrounding UI chrome is English.
//
// `point` is the dot position as a percentage of the image box. `card` is
// where the detail card anchors so it always lands inside the frame instead
// of being clamped at runtime.

export const HOTSPOTS = [
  {
    id: 'ceiling',
    zone: 'Ceiling & beams',
    point: { x: 40, y: 9 },
    card: { top: '15%', left: '31%' },
    product: {
      id: '1205577',
      name: 'ไม้ระแนง CONWOOD หน้า 2 นิ้ว 5X305X1.6 ซม. สีธรรมชาติ',
      brand: 'CONWOOD',
      price: 94,
      originalPrice: 148,
      unit: 'per length',
      image:
        'https://statice.homepro.co.th/homepro/ART_IMAGE/12/055/1205577/1000x1000/11112024_1205577$Imagec1.jpg',
      url: 'https://www.homepro.co.th/p/1205577',
    },
  },
  {
    id: 'wall',
    zone: 'Wall finish',
    point: { x: 23, y: 31 },
    card: { top: '39%', left: '7%' },
    product: {
      id: '237143',
      name: 'สีน้ำทาภายนอก ชนิดกึ่งเงา TOA SHIELD-1 BASE A 2.5 แกลลอน',
      brand: 'TOA',
      price: 1690,
      originalPrice: 2190,
      unit: 'per 2.5 gal',
      image:
        'https://statice.homepro.co.th/homepro/ART_IMAGE/02/371/237143/1000x1000/11022025_237143$Imagec1.jpg',
      url: 'https://www.homepro.co.th/p/237143',
    },
  },
  {
    id: 'door',
    zone: 'Sliding door',
    point: { x: 84, y: 24 },
    card: { top: '31%', right: '5%' },
    product: {
      id: '1310440',
      name: 'ประตูบานเลื่อน อะลูมิเนียม F-S-S-F มุ้ง KPA 240x204 ซม. สีขาว',
      brand: 'KPA',
      price: 8790,
      originalPrice: 9290,
      unit: 'per set',
      image:
        'https://statice.homepro.co.th/homepro/ART_IMAGE/13/104/1310440/1000x1000/29122025_1310440$Imagec1.jpg',
      url: 'https://www.homepro.co.th/p/1310440',
    },
  },
  {
    id: 'floor',
    zone: 'Flooring',
    point: { x: 58, y: 87 },
    card: { bottom: '9%', left: '44%' },
    product: {
      id: '1109392',
      name: 'กระเบื้องพื้นพอร์ซเลน 40x40 ซม. CERGRES จากัวร์ เทา A',
      brand: 'CERGRES',
      price: 289,
      originalPrice: 359,
      unit: 'per sq.m.',
      image:
        'https://statice.homepro.co.th/homepro/ART_IMAGE/11/093/1109392/1000x1000/10042023_1109392$Imagec1.jpg',
      url: 'https://www.homepro.co.th/p/1109392',
    },
  },
]

export const HOW_IT_WORKS_STEPS = [
  {
    n: '01',
    title: 'Photograph what you want to change',
    desc: 'One photo is enough. No floor plans, no measurements, no site visit.',
  },
  {
    n: '02',
    title: 'Torterm matches materials to surfaces',
    desc: 'It reads the image, then pulls real SKUs from the catalogue for the roof, walls, doors and floor.',
  },
  {
    n: '03',
    title: 'See the full cost before you commit',
    desc: 'You get an itemised list with live prices — ready to hand to your contractor or your budget.',
  },
]

// The catalogue contains a few bad originalPrice values (e.g. ฿52 marked down
// from ฿7,370). Only treat a markdown as real when it is plausible.
export function discountPct(product) {
  const { price, originalPrice } = product
  if (!originalPrice || originalPrice <= price) return 0
  const pct = Math.round(((originalPrice - price) / originalPrice) * 100)
  return pct > 70 ? 0 : pct
}
