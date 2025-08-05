// frontend/src/app/pages/page.tsx

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Zap, Shield, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Burocrazia Semplificata con
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Genera automaticamente documenti ufficiali, ricevi guide personalizzate e 
            semplifica tutti i tuoi adempimenti burocratici con l&apos;intelligenza artificiale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/partita-iva">
              <Button size="lg" className="text-lg px-8 py-3">
                Apri Partita IVA
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/autocertificazione-residenza">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Autocertificazione Residenza
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/autocertificazione-nascita">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Autocertificazione Nascita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            ✅ Gratuito per il primo documento • ✅ Guida AI inclusa • ✅ 100% legale
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Perché scegliere PraticAI?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trasformiamo la complessità burocratica in un processo semplice e veloce
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Documenti Automatici</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Genera moduli ufficiali precompilati con i tuoi dati in pochi click. 
                Formato PDF pronto per la presentazione.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Guide AI Personalizzate</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Ricevi istruzioni step-by-step personalizzate per la tua situazione specifica. 
                Come un consulente sempre disponibile.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>100% Conforme</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Tutti i documenti rispettano le normative vigenti e sono aggiornati 
                alle ultime disposizioni fiscali.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto a semplificare la tua burocrazia?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Scegli il servizio di cui hai bisogno
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/partita-iva">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Partita IVA
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/autocertificazione-residenza">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Autocertificazione Residenza
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/autocertificazione-nascita">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Autocertificazione Nascita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}