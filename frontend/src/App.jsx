import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoryGrid from './components/CategoryGrid'
import StatsBar from './components/StatsBar'
import HowItWorks from './components/HowItWorks'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <CategoryGrid />
      <StatsBar />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  )
}
