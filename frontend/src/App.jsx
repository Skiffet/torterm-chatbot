import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
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
        ? 'Torterm — ผู้ช่วย AI ปรับปรุงบ้านภายนอก'
        : 'Torterm — AI Home Exterior Renovation'
  }, [lang])

  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <CategoryGrid onSelectGroup={setActiveGroup} />
      <PromotionBanner />
      <ProductsSection activeGroup={activeGroup} onChangeGroup={setActiveGroup} />
      <StatsBar />
      <HowItWorks />
      <CTASection />
      <Footer />
      <AskAiButton />
    </div>
  )
}
