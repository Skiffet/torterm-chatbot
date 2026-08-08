import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import WholesaleHero from './components/wholesale/WholesaleHero'
import HouseRotationSection from './components/HouseRotationSection'
import EntryExperience from './components/wholesale/EntryExperience'
import CategoryGrid from './components/CategoryGrid'
import ProductsSection from './components/ProductsSection'
import StatsBar from './components/StatsBar'
import HowItWorks from './components/HowItWorks'
import CTASection from './components/CTASection'
import PromotionBanner from './components/PromotionBanner'
import Footer from './components/Footer'
import AskAiButton from './components/AskAiButton'
import { useLanguage } from './i18n/LanguageContext'

export default function App() {
  const [activeGroup, setActiveGroup] = useState('all')
  const { lang } = useLanguage()

  useEffect(() => {
    document.documentElement.lang = lang
    document.title =
      lang === 'th'
        ? 'Torterm — ศูนย์รวมวัสดุก่อสร้างและผู้ช่วย AI'
        : 'Torterm — Construction Materials & AI Assistant'
  }, [lang])

  return (
    <div className="bg-white">
      <Navbar />
      <WholesaleHero />
      <HouseRotationSection />
      <CategoryGrid onSelectGroup={setActiveGroup} />
      <PromotionBanner />
      <ProductsSection activeGroup={activeGroup} onChangeGroup={setActiveGroup} />
      <StatsBar />
      <HowItWorks />
      <CTASection />
      <Footer />
      <AskAiButton />
      <EntryExperience />
    </div>
  )
}
