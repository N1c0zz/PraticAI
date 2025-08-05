import AutocertificazioneNascitaForm from '@/components/forms/AutocertificazioneNascitaForm'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Baby, Lightbulb, Download } from 'lucide-react'

export default function AutocertificazioneNascitaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con sfondo bianco per questa pagina */}
      <div className="bg-white shadow-sm border-b">
        <Header />
      </div>

      {/* Hero Section per questa pagina */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Baby className="w-8 h-8" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              Autocertificazione di Nascita
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Genera automaticamente la tua autocertificazione di nascita valida per enti pubblici 
              e privati, con guida personalizzata su come utilizzarla correttamente.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4" />
                <span>Documento ufficiale DPR 445/2000</span>
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
        <AutocertificazioneNascitaForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}