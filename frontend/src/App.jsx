import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import HeroCinematic from './components/home/HeroCinematic'
import TrustStrip from './components/home/TrustStrip'
import CategoryShowcase from './components/home/CategoryShowcase'
import ProductRail from './components/home/ProductRail'
import AiThesis from './components/home/AiThesis'
import Benefits from './components/home/Benefits'
import FinalCTA from './components/home/FinalCTA'
import PromotionBanner from './components/PromotionBanner'
import ProductsSection from './components/ProductsSection'
import Footer from './components/Footer'
import AskAiButton from './components/AskAiButton'
import AuthModal from './components/overlays/AuthModal'
import CartDrawer from './components/overlays/CartDrawer'
import SearchOverlay from './components/overlays/SearchOverlay'
import MobileMenu from './components/overlays/MobileMenu'
import { useCatalog } from './context/CatalogContext'
import { useLanguage } from './i18n/LanguageContext'

export default function App() {
  const [activeGroup, setActiveGroup] = useState('all')
  const { lang, t } = useLanguage()
  const { deals, recommended, entryPrice, status } = useCatalog()

  useEffect(() => {
    document.documentElement.lang = lang
    document.title =
      lang === 'th'
        ? 'Torterm — วัสดุปรับปรุงบ้านภายนอก พร้อมราคาจริง'
        : 'Torterm — Exterior renovation materials, priced'
  }, [lang])

  return (
    <div className="bg-white">
      <Navbar onSelectGroup={setActiveGroup} />

      <main>
        <HeroCinematic />
        <TrustStrip />

        <CategoryShowcase onSelectGroup={setActiveGroup} />

        <ProductRail
          id="deals"
          tone="dark"
          eyebrow={t('rails.deals.eyebrow')}
          title={t('rails.deals.title')}
          description={t('rails.deals.description')}
          products={deals}
          status={status}
        />

        <PromotionBanner />

        <AiThesis />

        <ProductRail
          id="recommended"
          eyebrow={t('rails.recommended.eyebrow')}
          title={t('rails.recommended.title')}
          description={t('rails.recommended.description')}
          products={recommended}
          status={status}
        />

        <Benefits />

        <ProductRail
          id="entry-price"
          eyebrow={t('rails.entry.eyebrow')}
          title={t('rails.entry.title')}
          description={t('rails.entry.description')}
          products={entryPrice}
          status={status}
        />

        <ProductsSection activeGroup={activeGroup} onChangeGroup={setActiveGroup} />

        <FinalCTA />
      </main>

      <Footer onSelectGroup={setActiveGroup} />
      <AskAiButton />

      <AuthModal />
      <CartDrawer />
      <SearchOverlay />
      <MobileMenu onSelectGroup={setActiveGroup} />
    </div>
  )
}
