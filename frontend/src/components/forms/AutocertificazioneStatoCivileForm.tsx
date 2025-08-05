'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Download, FileText, Loader2, CheckCircle, User, MapPin, Calendar, Bot, Check, AlertTriangle, Info, Heart } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Import dei nostri tipi e hooks
import type { AutocertificazioneStatoCivileRequest } from '@/types/api'
import { useAutocertificazioneStatoCivile } from '@/hooks/useAutocertificazioneStatoCivile'
import { useDownload } from '@/hooks/useApi'

type AutocertificazioneStatoCivileFormData = AutocertificazioneStatoCivileRequest

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

export default function AutocertificazioneStatoCivileForm() {
  // Stato del form
  const [formData, setFormData] = useState<AutocertificazioneStatoCivileFormData>({
    nome: '',
    cognome: '',
    codiceFiscale: '',
    luogoNascita: '',
    dataNascita: '',
    comuneResidenza: '',
    indirizzoResidenza: '',
    statoCivile: 'celibe_nubile',
    nomeConiuge: '',
    cognomeConiuge: '',
    dataMatrimonio: '',
    comuneMatrimonio: '',
    dataSeparazione: '',
    dataDivorzio: '',
    tribunaleCompetente: '',
    dataDecesso: '',
    motivoRichiesta: ''
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})

  // Hooks per API calls
  const { loading, error: apiError, result, generateAutocertificazioneStatoCivile, reset } = useAutocertificazioneStatoCivile()
  const { downloadPdf, downloading } = useDownload()

  // Helper per aggiornare formData
  const updateFormData = (field: keyof AutocertificazioneStatoCivileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  // Validazione di base per i campi
  const validateForm = (): boolean => {
    const newErrors: Record<string, string | null> = {}

    // Campi base sempre richiesti
    if (!formData.nome.trim()) newErrors.nome = "Nome richiesto"
    if (!formData.cognome.trim()) newErrors.cognome = "Cognome richiesto"
    if (!formData.codiceFiscale.trim()) newErrors.codiceFiscale = "Codice fiscale richiesto"
    else if (formData.codiceFiscale.length !== 16) newErrors.codiceFiscale = "Il codice fiscale deve essere di 16 caratteri"
    if (!formData.luogoNascita.trim()) newErrors.luogoNascita = "Luogo di nascita richiesto"
    if (!formData.dataNascita.trim()) newErrors.dataNascita = "Data di nascita richiesta"
    if (!formData.comuneResidenza.trim()) newErrors.comuneResidenza = "Comune di residenza richiesto"
    if (!formData.indirizzoResidenza.trim()) newErrors.indirizzoResidenza = "Indirizzo di residenza richiesto"

    // Validazione condizionale per stato civile
    if (formData.statoCivile === 'coniugato') {
      if (!formData.nomeConiuge?.trim()) newErrors.nomeConiuge = "Nome del coniuge richiesto"
      if (!formData.cognomeConiuge?.trim()) newErrors.cognomeConiuge = "Cognome del coniuge richiesto"
      if (!formData.dataMatrimonio?.trim()) newErrors.dataMatrimonio = "Data matrimonio richiesta"
      if (!formData.comuneMatrimonio?.trim()) newErrors.comuneMatrimonio = "Comune matrimonio richiesto"
    }

    if (formData.statoCivile === 'separato') {
      if (!formData.dataSeparazione?.trim()) newErrors.dataSeparazione = "Data separazione richiesta"
      if (!formData.tribunaleCompetente?.trim()) newErrors.tribunaleCompetente = "Tribunale competente richiesto"
    }

    if (formData.statoCivile === 'divorziato') {
      if (!formData.dataDivorzio?.trim()) newErrors.dataDivorzio = "Data divorzio richiesta"
      if (!formData.tribunaleCompetente?.trim()) newErrors.tribunaleCompetente = "Tribunale competente richiesto"
    }

    if (formData.statoCivile === 'vedovo') {
      if (!formData.dataDecesso?.trim()) newErrors.dataDecesso = "Data decesso del coniuge richiesta"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    await generateAutocertificazioneStatoCivile(formData)
  }

  const handleDownload = async () => {
    if (result?.pdfUrl) {
      const fileId = result.pdfUrl.split('/').pop()
      if (fileId) {
        const filename = `autocertificazione_stato_civile_${formData.cognome}_${formData.nome}.pdf`
        await downloadPdf(fileId, filename)
      }
    }
  }

  const handleReset = () => {
    reset()
    setErrors({})
  }

  const getStatoCivileLabel = (statoCivile: string) => {
    const labels: Record<string, string> = {
      'celibe_nubile': 'Celibe/Nubile',
      'coniugato': 'Coniugato/a',
      'separato': 'Separato/a',
      'divorziato': 'Divorziato/a',
      'vedovo': 'Vedovo/a'
    }
    return labels[statoCivile] || statoCivile
  }

  // Render campi condizionali basati sullo stato civile
  const renderConditionalFields = () => {
    switch (formData.statoCivile) {
      case 'coniugato':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
            <div className="md:col-span-2">
              <h4 className="font-semibold text-pink-800 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Dati del Matrimonio
              </h4>
            </div>
            
            <div>
              <Label htmlFor="nomeConiuge">Nome del Coniuge *</Label>
              <Input
                id="nomeConiuge"
                value={formData.nomeConiuge || ''}
                onChange={(e) => updateFormData('nomeConiuge', e.target.value)}
                placeholder="Inserisci nome del coniuge"
              />
              <FieldFeedback error={errors.nomeConiuge} />
            </div>

            <div>
              <Label htmlFor="cognomeConiuge">Cognome del Coniuge *</Label>
              <Input
                id="cognomeConiuge"
                value={formData.cognomeConiuge || ''}
                onChange={(e) => updateFormData('cognomeConiuge', e.target.value)}
                placeholder="Inserisci cognome del coniuge"
              />
              <FieldFeedback error={errors.cognomeConiuge} />
            </div>

            <div>
              <Label htmlFor="dataMatrimonio">Data Matrimonio *</Label>
              <Input
                id="dataMatrimonio"
                type="date"
                value={formData.dataMatrimonio || ''}
                onChange={(e) => updateFormData('dataMatrimonio', e.target.value)}
              />
              <FieldFeedback error={errors.dataMatrimonio} />
            </div>

            <div>
              <Label htmlFor="comuneMatrimonio">Comune del Matrimonio *</Label>
              <Input
                id="comuneMatrimonio"
                value={formData.comuneMatrimonio || ''}
                onChange={(e) => updateFormData('comuneMatrimonio', e.target.value)}
                placeholder="Inserisci comune del matrimonio"
              />
              <FieldFeedback error={errors.comuneMatrimonio} />
            </div>
          </div>
        )

      case 'separato':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="md:col-span-2">
              <h4 className="font-semibold text-orange-800 mb-4">
                Dati della Separazione
              </h4>
            </div>
            
            <div>
              <Label htmlFor="dataSeparazione">Data Separazione *</Label>
              <Input
                id="dataSeparazione"
                type="date"
                value={formData.dataSeparazione || ''}
                onChange={(e) => updateFormData('dataSeparazione', e.target.value)}
              />
              <FieldFeedback error={errors.dataSeparazione} />
            </div>

            <div>
              <Label htmlFor="tribunaleCompetente">Tribunale Competente *</Label>
              <Input
                id="tribunaleCompetente"
                value={formData.tribunaleCompetente || ''}
                onChange={(e) => updateFormData('tribunaleCompetente', e.target.value)}
                placeholder="es. Tribunale di Roma"
              />
              <FieldFeedback error={errors.tribunaleCompetente} />
            </div>
          </div>
        )

      case 'divorziato':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="md:col-span-2">
              <h4 className="font-semibold text-red-800 mb-4">
                Dati del Divorzio
              </h4>
            </div>
            
            <div>
              <Label htmlFor="dataDivorzio">Data Divorzio *</Label>
              <Input
                id="dataDivorzio"
                type="date"
                value={formData.dataDivorzio || ''}
                onChange={(e) => updateFormData('dataDivorzio', e.target.value)}
              />
              <FieldFeedback error={errors.dataDivorzio} />
            </div>

            <div>
              <Label htmlFor="tribunaleCompetente">Tribunale Competente *</Label>
              <Input
                id="tribunaleCompetente"
                value={formData.tribunaleCompetente || ''}
                onChange={(e) => updateFormData('tribunaleCompetente', e.target.value)}
                placeholder="es. Tribunale di Milano"
              />
              <FieldFeedback error={errors.tribunaleCompetente} />
            </div>
          </div>
        )

      case 'vedovo':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="md:col-span-2">
              <h4 className="font-semibold text-gray-800 mb-4">
                Dati del Decesso
              </h4>
            </div>
            
            <div>
              <Label htmlFor="dataDecesso">Data Decesso del Coniuge *</Label>
              <Input
                id="dataDecesso"
                type="date"
                value={formData.dataDecesso || ''}
                onChange={(e) => updateFormData('dataDecesso', e.target.value)}
              />
              <FieldFeedback error={errors.dataDecesso} />
            </div>
          </div>
        )

      default:
        return null
    }
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
              Autocertificazione di Stato Civile Generata con Successo! 🎉
            </h2>
          </div>
          <p className="text-green-700">
            L&apos;autocertificazione di stato civile ({getStatoCivileLabel(formData.statoCivile)}) e la guida personalizzata sono pronte. 
            Segui le istruzioni qui sotto per utilizzare correttamente il documento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Download PDF - Colonna sinistra */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Download className="w-5 h-5" />
                  Autocertificazione
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Documento Ufficiale Pronto
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Stato Civile:</strong> {getStatoCivileLabel(formData.statoCivile)}
                  </p>
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
              <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Bot className="w-5 h-5" />
                  Guida Personalizzata AI
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {result.guida || 'Guida non disponibile.'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-purple-600" />
            Autocertificazione di Stato Civile
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Compila i dati richiesti per generare l&apos;autocertificazione di stato civile e ricevere 
            una guida personalizzata su come utilizzarla.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {apiError && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dati Personali */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Dati Personali
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => updateFormData('nome', e.target.value)}
                    placeholder="Inserisci il tuo nome"
                  />
                  <FieldFeedback error={errors.nome} />
                </div>

                <div>
                  <Label htmlFor="cognome">Cognome *</Label>
                  <Input
                    id="cognome"
                    value={formData.cognome}
                    onChange={(e) => updateFormData('cognome', e.target.value)}
                    placeholder="Inserisci il tuo cognome"
                  />
                  <FieldFeedback error={errors.cognome} />
                </div>

                <div>
                  <Label htmlFor="codiceFiscale">Codice Fiscale *</Label>
                  <Input
                    id="codiceFiscale"
                    value={formData.codiceFiscale}
                    onChange={(e) => updateFormData('codiceFiscale', e.target.value.toUpperCase())}
                    placeholder="RSSMRA80A01H501U"
                    maxLength={16}
                  />
                  <FieldFeedback error={errors.codiceFiscale} />
                </div>

                <div>
                  <Label htmlFor="dataNascita">Data di Nascita *</Label>
                  <Input
                    id="dataNascita"
                    type="date"
                    value={formData.dataNascita}
                    onChange={(e) => updateFormData('dataNascita', e.target.value)}
                  />
                  <FieldFeedback error={errors.dataNascita} />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="luogoNascita">Luogo di Nascita *</Label>
                  <Input
                    id="luogoNascita"
                    value={formData.luogoNascita}
                    onChange={(e) => updateFormData('luogoNascita', e.target.value)}
                    placeholder="Inserisci città e provincia di nascita"
                  />
                  <FieldFeedback error={errors.luogoNascita} />
                </div>
              </div>
            </div>

            {/* Residenza */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Residenza
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="comuneResidenza">Comune di Residenza *</Label>
                  <Input
                    id="comuneResidenza"
                    value={formData.comuneResidenza}
                    onChange={(e) => updateFormData('comuneResidenza', e.target.value)}
                    placeholder="Inserisci il comune"
                  />
                  <FieldFeedback error={errors.comuneResidenza} />
                </div>

                <div>
                  <Label htmlFor="indirizzoResidenza">Indirizzo Completo *</Label>
                  <Input
                    id="indirizzoResidenza"
                    value={formData.indirizzoResidenza}
                    onChange={(e) => updateFormData('indirizzoResidenza', e.target.value)}
                    placeholder="Via, numero civico, CAP"
                  />
                  <FieldFeedback error={errors.indirizzoResidenza} />
                </div>
              </div>
            </div>

            {/* Stato Civile */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Stato Civile
              </h3>
              
              <div className="mb-6">
                <Label htmlFor="statoCivile">Seleziona il tuo stato civile *</Label>
                <Select value={formData.statoCivile} onValueChange={(value) => updateFormData('statoCivile', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona stato civile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celibe_nubile">Celibe/Nubile</SelectItem>
                    <SelectItem value="coniugato">Coniugato/a</SelectItem>
                    <SelectItem value="separato">Separato/a</SelectItem>
                    <SelectItem value="divorziato">Divorziato/a</SelectItem>
                    <SelectItem value="vedovo">Vedovo/a</SelectItem>
                  </SelectContent>
                </Select>
                <FieldFeedback error={errors.statoCivile} />
              </div>

              {/* Campi condizionali */}
              {renderConditionalFields()}
            </div>

            {/* Motivo Richiesta */}
            <div>
              <Label htmlFor="motivoRichiesta">Motivo della Richiesta (opzionale)</Label>
              <Textarea
                id="motivoRichiesta"
                value={formData.motivoRichiesta || ''}
                onChange={(e) => updateFormData('motivoRichiesta', e.target.value)}
                placeholder="Specifica per quale uso ti serve l'autocertificazione (es. iscrizione all'università, pratiche bancarie...)"
                rows={3}
              />
              <FieldFeedback 
                suggestion="Specificare l'uso aiuterà l'AI a fornirti consigli più mirati"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                size="lg" 
                disabled={loading}
                className="min-w-[200px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generazione...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Genera Autocertificazione
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