
import PartitaIvaForm from '@/components/forms/PartitaIvaForm'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FileText, Lightbulb, Download } from 'lucide-react'

export default function PartitaIvaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con sfondo bianco per questa pagina */}
      <div className="bg-white shadow-sm border-b">
        <Header />
      </div>

      {/* Hero Section per questa pagina */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              Apertura Partita IVA Freelance
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Genera automaticamente il modulo AA9/12 e ricevi una guida personalizzata 
              per aprire la tua Partita IVA in modo semplice e veloce.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Modulo AA9/12 automatico</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Guida AI personalizzata</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>PDF pronto per l&apos;uso</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenuto principale */}
      <main className="py-12">
        <PartitaIvaForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}