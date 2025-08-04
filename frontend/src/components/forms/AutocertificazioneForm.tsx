'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Download, FileText, Loader2, CheckCircle, User, MapPin, Calendar, Bot, Check, AlertTriangle, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Import dei nostri tipi e hooks
import { AutocertificazioneFormData } from '@/lib/validations'
import { useAutocertificazione } from '@/hooks/useAutocertificazione'
import { useDownload } from '@/hooks/useApi'

// Componente per feedback di validazione
function FieldFeedback({ 
  error, 
  suggestion, 
  success 
}: { 
  error?: string | null
  suggestion?: string | null
  success?: boolean
}) {
  if (success) {
    return (
      <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
        <Check className="w-3 h-3" />
        <span>Valido</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
        <AlertTriangle className="w-3 h-3" />
        <span>{error}</span>
      </div>
    )
  }
  
  if (suggestion) {
    return (
      <div className="flex items-center gap-1 text-blue-600 text-xs mt-1">
        <Info className="w-3 h-3" />
        <span>{suggestion}</span>
      </div>
    )
  }
  
  return null
}

export default function AutocertificazioneForm() {
  // Stato del form
  const [formData, setFormData] = useState<AutocertificazioneFormData>({
    nome: '',
    cognome: '',
    codiceFiscale: '',
    luogoNascita: '',
    dataNascita: '',
    comuneResidenza: '',
    indirizzoResidenza: '',
    motivoRichiesta: ''
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})

  // Hooks per API calls
  const { loading, error: apiError, result, generateAutocertificazione, reset } = useAutocertificazione()
  const { downloadPdf, downloading } = useDownload()

  // Helper per aggiornare formData
  const updateFormData = (field: keyof AutocertificazioneFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Validazione di base per i campi
  const validateForm = (): boolean => {
    const newErrors: Record<string, string | null> = {}

    if (!formData.nome.trim()) newErrors.nome = "Nome richiesto"
    if (!formData.cognome.trim()) newErrors.cognome = "Cognome richiesto"
    if (!formData.codiceFiscale.trim()) newErrors.codiceFiscale = "Codice fiscale richiesto"
    else if (formData.codiceFiscale.length !== 16) newErrors.codiceFiscale = "Il codice fiscale deve essere di 16 caratteri"
    if (!formData.luogoNascita.trim()) newErrors.luogoNascita = "Luogo di nascita richiesto"
    if (!formData.dataNascita.trim()) newErrors.dataNascita = "Data di nascita richiesta"
    if (!formData.comuneResidenza.trim()) newErrors.comuneResidenza = "Comune di residenza richiesto"
    if (!formData.indirizzoResidenza.trim()) newErrors.indirizzoResidenza = "Indirizzo di residenza richiesto"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    await generateAutocertificazione(formData)
  }

  const handleDownload = async () => {
    if (result?.pdfUrl) {
      const fileId = result.pdfUrl.split('/').pop()
      if (fileId) {
        const filename = `autocertificazione_residenza_${formData.cognome}_${formData.nome}.pdf`
        await downloadPdf(fileId, filename)
      }
    }
  }

  const handleReset = () => {
    reset()
    setErrors({})
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
              Autocertificazione Generata con Successo! 🎉
            </h2>
          </div>
          <p className="text-green-700">
            L&apos;autocertificazione di residenza e la guida personalizzata sono pronte. 
            Segui le istruzioni qui sotto per utilizzare correttamente il documento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Download PDF - Colonna sinistra */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Download className="w-5 h-5" />
                  Autocertificazione
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
                    L&apos;autocertificazione è precompilata con i tuoi dati e pronta per l&apos;uso presso enti pubblici e privati.
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
                  Genera Nuova Autocertificazione
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Guida AI - Colonna destra */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Bot className="w-5 h-5" />
                  Guida Personalizzata AI
                </CardTitle>
                <p className="text-sm text-purple-700 mt-1">
                  Istruzioni step-by-step per utilizzare correttamente la tua autocertificazione
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="ai-guide">
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
            Tutti i campi contrassegnati con * sono obbligatori. 
            L&apos;autocertificazione ha valore legale secondo il DPR 445/2000.
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
                  <Label htmlFor="nome" className="mb-2 block">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => updateFormData('nome', e.target.value)}
                    className={errors.nome ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.nome}
                    success={!!formData.nome && !errors.nome}
                  />
                </div>
                <div>
                  <Label htmlFor="cognome" className="mb-2 block">Cognome *</Label>
                  <Input
                    id="cognome"
                    value={formData.cognome}
                    onChange={(e) => updateFormData('cognome', e.target.value)}
                    className={errors.cognome ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.cognome}
                    success={!!formData.cognome && !errors.cognome}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="codiceFiscale" className="mb-2 block">Codice Fiscale *</Label>
                <Input
                  id="codiceFiscale"
                  value={formData.codiceFiscale}
                  onChange={(e) => updateFormData('codiceFiscale', e.target.value.toUpperCase())}
                  maxLength={16}
                  placeholder="RSSMRA80A01H501X"
                  className={errors.codiceFiscale ? 'border-red-500' : ''}
                  required
                />
                <FieldFeedback 
                  error={errors.codiceFiscale}
                  success={formData.codiceFiscale.length === 16 && !errors.codiceFiscale}
                />
              </div>
            </div>

            {/* Dati di Nascita */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Calendar className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-gray-900">Dati di Nascita</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="luogoNascita">Luogo di Nascita *</Label>
                  <Input
                    id="luogoNascita"
                    value={formData.luogoNascita}
                    onChange={(e) => updateFormData('luogoNascita', e.target.value)}
                    placeholder="Milano"
                    className={errors.luogoNascita ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.luogoNascita}
                    success={!!formData.luogoNascita && !errors.luogoNascita}
                  />
                </div>
                <div>
                  <Label htmlFor="dataNascita">Data di Nascita *</Label>
                  <Input
                    id="dataNascita"
                    type="date"
                    value={formData.dataNascita}
                    onChange={(e) => updateFormData('dataNascita', e.target.value)}
                    className={errors.dataNascita ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.dataNascita}
                    success={!!formData.dataNascita && !errors.dataNascita}
                  />
                </div>
              </div>
            </div>

            {/* Residenza */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <MapPin className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Residenza Attuale</h3>
              </div>
              
              <div>
                <Label htmlFor="comuneResidenza">Comune di Residenza *</Label>
                <Input
                  id="comuneResidenza"
                  value={formData.comuneResidenza}
                  onChange={(e) => updateFormData('comuneResidenza', e.target.value)}
                  placeholder="Milano"
                  className={errors.comuneResidenza ? 'border-red-500' : ''}
                  required
                />
                <FieldFeedback 
                  error={errors.comuneResidenza}
                  success={!!formData.comuneResidenza && !errors.comuneResidenza}
                />
              </div>

              <div>
                <Label htmlFor="indirizzoResidenza">Indirizzo di Residenza *</Label>
                <Input
                  id="indirizzoResidenza"
                  value={formData.indirizzoResidenza}
                  onChange={(e) => updateFormData('indirizzoResidenza', e.target.value)}
                  placeholder="Via Roma, 123"
                  className={errors.indirizzoResidenza ? 'border-red-500' : ''}
                  required
                />
                <FieldFeedback 
                  error={errors.indirizzoResidenza}
                  success={!!formData.indirizzoResidenza && !errors.indirizzoResidenza}
                />
              </div>

              <div>
                <Label htmlFor="motivoRichiesta">Motivo della Richiesta (opzionale)</Label>
                <Textarea
                  id="motivoRichiesta"
                  value={formData.motivoRichiesta || ''}
                  onChange={(e) => updateFormData('motivoRichiesta', e.target.value)}
                  placeholder="es. Iscrizione scuola, apertura conto corrente, pratiche amministrative..."
                  rows={3}
                  maxLength={300}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    Specifica il motivo per ricevere consigli personalizzati nella guida AI
                  </span>
                  <span className="text-xs text-gray-500">
                    {(formData.motivoRichiesta || '').length}/300
                  </span>
                </div>
              </div>
            </div>

            {/* Error Display API */}
            {apiError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
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
                    Genera Autocertificazione e Guida AI
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