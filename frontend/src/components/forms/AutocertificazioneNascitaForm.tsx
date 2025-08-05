'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Download, FileText, Loader2, CheckCircle, User, Bot, Check, AlertTriangle, Info, Baby } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Import dei nostri tipi e hooks
import { AutocertificazioneNascitaFormData } from '@/lib/validations'
import { useAutocertificazioneNascita } from '@/hooks/useAutocertificazioneNascita'
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

export default function AutocertificazioneNascitaForm() {
  // Stato del form
  const [formData, setFormData] = useState<AutocertificazioneNascitaFormData>({
    nomeDichiarante: '',
    cognomeDichiarante: '',
    codiceFiscaleDichiarante: '',
    nomeNato: '',
    cognomeNato: '',
    dataNascita: '',
    luogoNascita: '',
    provinciaNascita: '',
    ospedale: '',
    motivoRichiesta: ''
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})

  // Hooks per API calls
  const { loading, error: apiError, result, generateAutocertificazioneNascita, reset } = useAutocertificazioneNascita()
  const { downloadPdf, downloading } = useDownload()

  // Helper per aggiornare formData
  const updateFormData = (field: keyof AutocertificazioneNascitaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Validazione di base per i campi
  const validateForm = (): boolean => {
    const newErrors: Record<string, string | null> = {}

    // Dati dichiarante
    if (!formData.nomeDichiarante.trim()) newErrors.nomeDichiarante = "Nome dichiarante richiesto"
    if (!formData.cognomeDichiarante.trim()) newErrors.cognomeDichiarante = "Cognome dichiarante richiesto"
    if (!formData.codiceFiscaleDichiarante.trim()) newErrors.codiceFiscaleDichiarante = "Codice fiscale dichiarante richiesto"
    else if (formData.codiceFiscaleDichiarante.length !== 16) newErrors.codiceFiscaleDichiarante = "Il codice fiscale deve essere di 16 caratteri"

    // Dati nato/nata
    if (!formData.nomeNato.trim()) newErrors.nomeNato = "Nome del nato/nata richiesto"
    if (!formData.cognomeNato.trim()) newErrors.cognomeNato = "Cognome del nato/nata richiesto"
    if (!formData.dataNascita.trim()) newErrors.dataNascita = "Data di nascita richiesta"
    if (!formData.luogoNascita.trim()) newErrors.luogoNascita = "Luogo di nascita richiesto"
    if (!formData.provinciaNascita.trim()) newErrors.provinciaNascita = "Provincia richiesta"
    else if (formData.provinciaNascita.length !== 2) newErrors.provinciaNascita = "La provincia deve essere di 2 caratteri"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    await generateAutocertificazioneNascita(formData)
  }

  const handleDownload = async () => {
    if (result?.pdfUrl) {
      const fileId = result.pdfUrl.split('/').pop()
      if (fileId) {
        const filename = `autocertificazione_nascita_${formData.cognomeNato}_${formData.nomeNato}.pdf`
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
              Autocertificazione di Nascita Generata con Successo! 🎉
            </h2>
          </div>
          <p className="text-green-700">
            L&apos;autocertificazione di nascita e la guida personalizzata sono pronte. 
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
                  Autocertificazione Nascita
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Baby className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Documento Ufficiale Pronto
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    L&apos;autocertificazione di nascita è precompilata con i dati forniti e pronta per l&apos;uso presso enti pubblici e privati.
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
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none">
                  {result.guida ? (
                    <div 
                      className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: result.guida.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                      }}
                    />
                  ) : (
                    <p className="text-gray-600">
                      Nessuna guida disponibile al momento. Il PDF è stato generato correttamente.
                    </p>
                  )}
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
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Baby className="w-6 h-6 text-green-600" />
            Genera Autocertificazione di Nascita
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Compila tutti i campi richiesti per generare automaticamente l&apos;autocertificazione di nascita 
            con la relativa guida personalizzata.
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Dati del Dichiarante */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Dati del Dichiarante</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nomeDichiarante" className="text-sm font-medium">
                    Nome Dichiarante *
                  </Label>
                  <Input
                    id="nomeDichiarante"
                    value={formData.nomeDichiarante}
                    onChange={(e) => updateFormData('nomeDichiarante', e.target.value)}
                    placeholder="Es. Mario"
                    className={errors.nomeDichiarante ? 'border-red-500' : ''}
                  />
                  <FieldFeedback error={errors.nomeDichiarante} />
                </div>

                <div>
                  <Label htmlFor="cognomeDichiarante" className="text-sm font-medium">
                    Cognome Dichiarante *
                  </Label>
                  <Input
                    id="cognomeDichiarante"
                    value={formData.cognomeDichiarante}
                    onChange={(e) => updateFormData('cognomeDichiarante', e.target.value)}
                    placeholder="Es. Rossi"
                    className={errors.cognomeDichiarante ? 'border-red-500' : ''}
                  />
                  <FieldFeedback error={errors.cognomeDichiarante} />
                </div>
              </div>

              <div>
                <Label htmlFor="codiceFiscaleDichiarante" className="text-sm font-medium">
                  Codice Fiscale Dichiarante *
                </Label>
                <Input
                  id="codiceFiscaleDichiarante"
                  value={formData.codiceFiscaleDichiarante}
                  onChange={(e) => updateFormData('codiceFiscaleDichiarante', e.target.value.toUpperCase())}
                  placeholder="Es. RSSMRA85M01H501Z"
                  className={errors.codiceFiscaleDichiarante ? 'border-red-500' : ''}
                  maxLength={16}
                />
                <FieldFeedback error={errors.codiceFiscaleDichiarante} />
              </div>
            </div>

            {/* Dati del Nato/Nata */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Baby className="w-5 h-5 text-pink-600" />
                <h3 className="text-lg font-semibold text-gray-800">Dati del Nato/Nata</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nomeNato" className="text-sm font-medium">
                    Nome del Nato/Nata *
                  </Label>
                  <Input
                    id="nomeNato"
                    value={formData.nomeNato}
                    onChange={(e) => updateFormData('nomeNato', e.target.value)}
                    placeholder="Es. Giulia"
                    className={errors.nomeNato ? 'border-red-500' : ''}
                  />
                  <FieldFeedback error={errors.nomeNato} />
                </div>

                <div>
                  <Label htmlFor="cognomeNato" className="text-sm font-medium">
                    Cognome del Nato/Nata *
                  </Label>
                  <Input
                    id="cognomeNato"
                    value={formData.cognomeNato}
                    onChange={(e) => updateFormData('cognomeNato', e.target.value)}
                    placeholder="Es. Rossi"
                    className={errors.cognomeNato ? 'border-red-500' : ''}
                  />
                  <FieldFeedback error={errors.cognomeNato} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="dataNascita" className="text-sm font-medium">
                    Data di Nascita *
                  </Label>
                  <Input
                    id="dataNascita"
                    type="date"
                    value={formData.dataNascita}
                    onChange={(e) => updateFormData('dataNascita', e.target.value)}
                    className={errors.dataNascita ? 'border-red-500' : ''}
                  />
                  <FieldFeedback error={errors.dataNascita} />
                </div>

                <div>
                  <Label htmlFor="luogoNascita" className="text-sm font-medium">
                    Luogo di Nascita *
                  </Label>
                  <Input
                    id="luogoNascita"
                    value={formData.luogoNascita}
                    onChange={(e) => updateFormData('luogoNascita', e.target.value)}
                    placeholder="Es. Roma"
                    className={errors.luogoNascita ? 'border-red-500' : ''}
                  />
                  <FieldFeedback error={errors.luogoNascita} />
                </div>

                <div>
                  <Label htmlFor="provinciaNascita" className="text-sm font-medium">
                    Provincia *
                  </Label>
                  <Input
                    id="provinciaNascita"
                    value={formData.provinciaNascita}
                    onChange={(e) => updateFormData('provinciaNascita', e.target.value.toUpperCase())}
                    placeholder="Es. RM"
                    className={errors.provinciaNascita ? 'border-red-500' : ''}
                    maxLength={2}
                  />
                  <FieldFeedback error={errors.provinciaNascita} />
                </div>
              </div>

              <div>
                <Label htmlFor="ospedale" className="text-sm font-medium">
                  Ospedale/Struttura (opzionale)
                </Label>
                <Input
                  id="ospedale"
                  value={formData.ospedale}
                  onChange={(e) => updateFormData('ospedale', e.target.value)}
                  placeholder="Es. Ospedale Sant'Andrea"
                />
                <FieldFeedback suggestion="Specificare l'ospedale o struttura dove è avvenuta la nascita può essere utile per alcuni usi" />
              </div>
            </div>

            {/* Motivo della Richiesta */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Informazioni Aggiuntive</h3>
              </div>

              <div>
                <Label htmlFor="motivoRichiesta" className="text-sm font-medium">
                  Motivo della Richiesta (opzionale)
                </Label>
                <Textarea
                  id="motivoRichiesta"
                  value={formData.motivoRichiesta}
                  onChange={(e) => updateFormData('motivoRichiesta', e.target.value)}
                  placeholder="Es. Per iscrizione all'asilo nido, per pratiche anagrafiche, per richiesta passaporto..."
                  rows={3}
                  maxLength={300}
                />
                <FieldFeedback suggestion="Specificare il motivo aiuta l'AI a fornire consigli più mirati" />
              </div>
            </div>

            {/* Errore API */}
            {apiError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {apiError}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generazione in corso...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Genera Autocertificazione di Nascita
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