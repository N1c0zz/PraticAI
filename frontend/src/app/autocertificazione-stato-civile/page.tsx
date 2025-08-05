import AutocertificazioneStatoCivileForm from '@/components/forms/AutocertificazioneStatoCivileForm'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Heart, Lightbulb, Download } from 'lucide-react'

export default function AutocertificazioneStatoCivilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con sfondo bianco per questa pagina */}
      <div className="bg-white shadow-sm border-b">
        <Header />
      </div>

      {/* Hero Section per questa pagina */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              Autocertificazione di Stato Civile
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Genera automaticamente la tua autocertificazione di stato civile valida per enti pubblici 
              e privati, con guida personalizzata basata sulla tua situazione specifica.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Documento ufficiale DPR 445/2000</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Guida AI personalizzata per stato civile</span>
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
        <AutocertificazioneStatoCivileForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}