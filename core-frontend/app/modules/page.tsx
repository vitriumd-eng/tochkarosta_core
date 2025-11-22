import { Header } from '@/components/platform/Header'
import { Footer } from '@/components/platform/Footer'
import { ModulesHero } from '@/components/platform/ModulesHero'
import { ModulesPage } from '@/components/platform/ModulesPage'

export default async function ModulesRoute() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-indigo-100">
      <Header />
      <ModulesHero />
      <ModulesPage />
      <Footer />
    </div>
  )
}

