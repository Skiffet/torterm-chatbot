// Maps the 40 scraped subcategories (real Thai category strings from the
// scraped data — never translated) into broader shopping groups for filtering.
// `labelKey` points into translations.js's `categoryFilters` for the display label.
export const CATEGORY_GROUPS = [
  {
    id: 'door-window',
    labelKey: 'categoryFilters.doorWindow',
    categories: [
      'ประตูภายนอก',
      'ประตูอลูมิเนียม',
      'ประตู UPVC',
      'หน้าต่างอลูมิเนียม',
      'หน้าต่าง UPVC',
      'เหล็กดัด',
      'มุ้งลวด',
    ],
  },
  {
    id: 'floor-wall',
    labelKey: 'categoryFilters.floorWall',
    categories: [
      'กระเบื้องพื้นภายนอก',
      'หินธรรมชาติ',
      'หินสังเคราะห์',
      'กระเบื้องผนัง',
      'แผ่นตกแต่งผนัง',
    ],
  },
  {
    id: 'roof-structure',
    labelKey: 'categoryFilters.roofStructure',
    categories: [
      'กันสาด',
      'รางน้ำฝนและอุปกรณ์',
      'หลังคาเมทัลชีท',
      'กระเบื้องหลังคาคอนกรีต',
      'กระเบื้องหลังคาลอน',
      'ครอบหลังคา',
      'ไม้รั้ว',
      'ไม้ระแนง',
      'เชิงชาย',
      'ไม้ฝา',
      'ฉนวนใยแก้ว',
      'ฉนวนใยหิน',
      'อิฐมวลเบา',
      'อิฐบล็อก',
      'เหล็กเส้น',
    ],
  },
  {
    id: 'garden-outdoor',
    labelKey: 'categoryFilters.gardenOutdoor',
    categories: [
      'รั้ว',
      'ทางเท้า',
      'หญ้าเทียม',
      'น้ำพุแต่งสวน',
      'หินตกแต่งสวน',
      'เฟอร์นิเจอร์นอกบ้าน',
      'กระถางต้นไม้และอุปกรณ์',
    ],
  },
  {
    id: 'paint',
    labelKey: 'categoryFilters.paint',
    categories: [
      'สีน้ำทาภายนอก',
      'สีผสมทาภายนอก',
      'สีทาหลังคา',
      'สีงานไม้',
      'น้ำยากำจัดเชื้อราและตะไคร่น้ำ',
      'อุปกรณ์ทาสี',
    ],
  },
]

export function groupIdForCategory(category) {
  return CATEGORY_GROUPS.find((g) => g.categories.includes(category))?.id ?? null
}
