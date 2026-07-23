import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoryGrid from './components/CategoryGrid'
import ProductsSection from './components/ProductsSection'
import StatsBar from './components/StatsBar'
import HowItWorks from './components/HowItWorks'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import AskAiButton from './components/AskAiButton'

export default function App() {
  const [activeGroup, setActiveGroup] = useState('all')

  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <CategoryGrid onSelectGroup={setActiveGroup} />
      <ProductsSection activeGroup={activeGroup} onChangeGroup={setActiveGroup} />
      <StatsBar />
      <HowItWorks />
      <CTASection />
      <Footer />
      <AskAiButton />
    </div>
  )
}
