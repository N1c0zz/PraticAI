// frontend/src/components/forms/PartitaIvaForm.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Download, FileText, Loader2, CheckCircle, User, MapPin, Mail, Briefcase } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Import dei nostri nuovi tipi e hooks
import { PartitaIvaRequest } from '@/types/api'
import { usePartitaIva, useDownload } from '@/hooks/useApi'

export default function PartitaIvaForm() {
  // Stato del form
  const [formData, setFormData] = useState<PartitaIvaRequest>({
    nome: '',
    cognome: '',
    codiceFiscale: '',
    indirizzo: '',
    civico: '',
    cap: '',
    comune: '',
    provincia: '',
    codiceAteco: '',
    descrizioneAttivita: '',
    regimeFiscale: 'forfettario',
    dataInizio: '',
    email: '',
    telefono: ''
  })

  // Hooks per API calls
  const { loading, error, result, generatePartitaIva, reset } = usePartitaIva()
  const { downloadPdf, downloading } = useDownload()

  const handleInputChange = (field: keyof PartitaIvaRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await generatePartitaIva(formData)
  }

  const handleDownload = async () => {
    if (result?.pdfUrl) {
      // Estrai file ID dall'URL (es. /api/download/abc123)
      const fileId = result.pdfUrl.split('/').pop()
      if (fileId) {
        const filename = `modulo_aa912_${formData.cognome}_${formData.nome}.pdf`
        await downloadPdf(fileId, filename)
      }
    }
  }

  const handleReset = () => {
    reset()
    // Resetta anche il form se vuoi
    // setFormData({ ... valori vuoti ... })
  }

  // Se abbiamo un risultato, mostra la success page
  if (result && result.success) {
    return (
      <div className="max-w-6xl mx-auto px-6">
        {/* Success Header */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-green-900">
              Documenti Generati con Successo! 🎉
            </h2>
          </div>
          <p className="text-green-700">
            Il modulo AA9/12 e la guida personalizzata sono pronti. 
            Segui le istruzioni qui sotto per completare l'apertura della tua Partita IVA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Download PDF - Colonna sinistra */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Download className="w-5 h-5" />
                  Modulo AA9/12
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Documento Ufficiale Pronto
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Il modulo è precompilato con i tuoi dati e pronto per la presentazione all'Agenzia delle Entrate.
                  </p>
                </div>
                
                <Button 
                  onClick={handleDownload} 
                  className="w-full mb-3" 
                  size="lg"
                  disabled={downloading}
                >
                  {downloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Download...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Scarica PDF
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleReset}
                  variant="outline" 
                  className="w-full"
                >
                  Genera Nuovo Modulo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Guida AI - Colonna destra */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  🤖 Guida Personalizzata AI
                </CardTitle>
                <p className="text-sm text-purple-700 mt-1">
                  Istruzioni step-by-step create appositamente per la tua situazione
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {result.guida}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Form principale
  return (
    <div className="max-w-4xl mx-auto px-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Compila i Tuoi Dati
          </CardTitle>
          <p className="text-gray-600">
            Tutti i campi contrassegnati con * sono obbligatori
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dati Personali */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Dati Personali</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cognome">Cognome *</Label>
                  <Input
                    id="cognome"
                    value={formData.cognome}
                    onChange={(e) => handleInputChange('cognome', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="codiceFiscale">Codice Fiscale *</Label>
                <Input
                  id="codiceFiscale"
                  value={formData.codiceFiscale}
                  onChange={(e) => handleInputChange('codiceFiscale', e.target.value.toUpperCase())}
                  maxLength={16}
                  placeholder="RSSMRA80A01H501X"
                  required
                />
              </div>
            </div>

            {/* Residenza */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <MapPin className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-gray-900">Residenza</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="indirizzo">Indirizzo *</Label>
                  <Input
                    id="indirizzo"
                    value={formData.indirizzo}
                    onChange={(e) => handleInputChange('indirizzo', e.target.value)}
                    placeholder="Via Roma"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="civico">Civico *</Label>
                  <Input
                    id="civico"
                    value={formData.civico}
                    onChange={(e) => handleInputChange('civico', e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cap">CAP *</Label>
                  <Input
                    id="cap"
                    value={formData.cap}
                    onChange={(e) => handleInputChange('cap', e.target.value)}
                    maxLength={5}
                    placeholder="20100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comune">Comune *</Label>
                  <Input
                    id="comune"
                    value={formData.comune}
                    onChange={(e) => handleInputChange('comune', e.target.value)}
                    placeholder="Milano"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Input
                    id="provincia"
                    value={formData.provincia}
                    onChange={(e) => handleInputChange('provincia', e.target.value.toUpperCase())}
                    maxLength={2}
                    placeholder="MI"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contatti */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Mail className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Contatti</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="mario.rossi@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono || ''}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="333 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* Attività */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Briefcase className="w-4 h-4 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Attività Professionale</h3>
              </div>
              
              <div>
                <Label htmlFor="codiceAteco">Codice ATECO *</Label>
                <Input
                  id="codiceAteco"
                  value={formData.codiceAteco}
                  onChange={(e) => handleInputChange('codiceAteco', e.target.value)}
                  placeholder="62.01.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descrizioneAttivita">Descrizione Attività *</Label>
                <Textarea
                  id="descrizioneAttivita"
                  value={formData.descrizioneAttivita}
                  onChange={(e) => handleInputChange('descrizioneAttivita', e.target.value)}
                  placeholder="es. Sviluppo software e applicazioni web"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="regimeFiscale">Regime Fiscale *</Label>
                  <Select 
                    value={formData.regimeFiscale} 
                    onValueChange={(value: 'forfettario' | 'ordinario') => handleInputChange('regimeFiscale', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forfettario">Regime Forfettario</SelectItem>
                      <SelectItem value="ordinario">Regime Ordinario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dataInizio">Data Inizio Attività *</Label>
                  <Input
                    id="dataInizio"
                    type="date"
                    value={formData.dataInizio}
                    onChange={(e) => handleInputChange('dataInizio', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generazione in corso...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Genera Modulo e Guida AI
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}