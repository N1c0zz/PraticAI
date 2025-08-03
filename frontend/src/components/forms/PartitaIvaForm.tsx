'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Download, FileText, Loader2, CheckCircle, User, MapPin, Mail, Briefcase, Calendar, Bot, ExternalLink, Info, AlertTriangle, Check } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Import dei nostri nuovi tipi e hooks
import { PartitaIvaFormData } from '@/lib/validations'
import { useFormValidation } from '@/hooks/useFormValidation'
import { usePartitaIva, useDownload } from '@/hooks/useApi'

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

export default function PartitaIvaForm() {
  // Stato del form
  const [formData, setFormData] = useState<PartitaIvaFormData>({
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
  const { loading, error: apiError, result, generatePartitaIva, reset } = usePartitaIva()
  const { downloadPdf, downloading } = useDownload()
  
  // Hook per validazione
  const {
    errors,
    validateForm,
    createFieldHandler,
    createBlurHandler,
    getFieldSuggestion,
    clearErrors
  } = useFormValidation()

  // Helper per aggiornare formData
  const updateFormData = (field: keyof PartitaIvaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Crea handler per ogni campo
  const createFieldHandlers = (fieldName: keyof PartitaIvaFormData) => ({
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      updateFormData(fieldName, value)
      createFieldHandler(fieldName, () => {})(value)
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      createBlurHandler(fieldName, formData[fieldName])()
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validazione completa prima dell'invio
    const validation = validateForm(formData)
    if (!validation.isValid) {
      return // Gli errori sono già visualizzati
    }
    
    await generatePartitaIva(formData)
  }

  const handleDownload = async () => {
    if (result?.pdfUrl) {
      const fileId = result.pdfUrl.split('/').pop()
      if (fileId) {
        const filename = `modulo_aa912_${formData.cognome}_${formData.nome}.pdf`
        await downloadPdf(fileId, filename)
      }
    }
  }

  const handleReset = () => {
    reset()
    clearErrors()
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
                  <Bot className="w-5 h-5" />
                  Guida Personalizzata AI
                </CardTitle>
                <p className="text-sm text-purple-700 mt-1">
                  Istruzioni step-by-step create appositamente per la tua situazione
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
            Tutti i campi contrassegnati con * sono obbligatori. I dati vengono validati in tempo reale.
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
                    {...createFieldHandlers('nome')}
                    className={errors.nome ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.nome?.message}
                    success={!!formData.nome && !errors.nome}
                  />
                </div>
                <div>
                  <Label htmlFor="cognome" className="mb-2 block">Cognome *</Label>
                  <Input
                    id="cognome"
                    value={formData.cognome}
                    {...createFieldHandlers('cognome')}
                    className={errors.cognome ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.cognome?.message}
                    success={!!formData.cognome && !errors.cognome}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="codiceFiscale" className="mb-2 block">Codice Fiscale *</Label>
                <Input
                  id="codiceFiscale"
                  value={formData.codiceFiscale}
                  {...createFieldHandlers('codiceFiscale')}
                  maxLength={16}
                  placeholder="RSSMRA80A01H501X"
                  className={errors.codiceFiscale ? 'border-red-500' : ''}
                  required
                />
                <FieldFeedback 
                  error={errors.codiceFiscale?.message}
                  suggestion={getFieldSuggestion('codiceFiscale', formData.codiceFiscale)}
                  success={formData.codiceFiscale.length === 16 && !errors.codiceFiscale}
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
                    {...createFieldHandlers('indirizzo')}
                    placeholder="Via Roma"
                    className={errors.indirizzo ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.indirizzo?.message}
                    success={!!formData.indirizzo && !errors.indirizzo}
                  />
                </div>
                <div>
                  <Label htmlFor="civico">Civico *</Label>
                  <Input
                    id="civico"
                    value={formData.civico}
                    {...createFieldHandlers('civico')}
                    placeholder="123"
                    className={errors.civico ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.civico?.message}
                    success={!!formData.civico && !errors.civico}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cap">CAP *</Label>
                  <Input
                    id="cap"
                    value={formData.cap}
                    {...createFieldHandlers('cap')}
                    placeholder="20100"
                    className={errors.cap ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.cap?.message}
                    success={formData.cap.length === 5 && !errors.cap}
                  />
                </div>
                <div>
                  <Label htmlFor="comune">Comune *</Label>
                  <Input
                    id="comune"
                    value={formData.comune}
                    {...createFieldHandlers('comune')}
                    placeholder="Milano"
                    className={errors.comune ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.comune?.message}
                    success={!!formData.comune && !errors.comune}
                  />
                </div>
                <div>
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Input
                    id="provincia"
                    value={formData.provincia}
                    {...createFieldHandlers('provincia')}
                    placeholder="MI"
                    className={errors.provincia ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.provincia?.message}
                    success={formData.provincia.length === 2 && !errors.provincia}
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
                    {...createFieldHandlers('email')}
                    placeholder="mario.rossi@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.email?.message}
                    success={!!formData.email && !errors.email}
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono || ''}
                    {...createFieldHandlers('telefono')}
                    placeholder="333 123 4567"
                    className={errors.telefono ? 'border-red-500' : ''}
                  />
                  <FieldFeedback 
                    error={errors.telefono?.message}
                    success={!!formData.telefono && !errors.telefono}
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
                  {...createFieldHandlers('codiceAteco')}
                  placeholder="62.01.00"
                  className={errors.codiceAteco ? 'border-red-500' : ''}
                  required
                />
                <FieldFeedback 
                  error={errors.codiceAteco?.message}
                  success={!!formData.codiceAteco && !errors.codiceAteco}
                />
                <p className="text-xs text-blue-600 mt-1">
                  Non conosci il tuo codice ATECO? {' '}
                  <a 
                    href="https://www.codiceateco.it/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:no-underline inline-flex items-center gap-1"
                  >
                    Cerca qui <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              <div>
                <Label htmlFor="descrizioneAttivita">Descrizione Attività *</Label>
                <Textarea
                  id="descrizioneAttivita"
                  value={formData.descrizioneAttivita}
                  {...createFieldHandlers('descrizioneAttivita')}
                  placeholder="es. Sviluppo software e applicazioni web"
                  rows={3}
                  className={errors.descrizioneAttivita ? 'border-red-500' : ''}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  <FieldFeedback 
                    error={errors.descrizioneAttivita?.message}
                    success={!!formData.descrizioneAttivita && !errors.descrizioneAttivita}
                  />
                  <span className="text-xs text-gray-500">
                    {formData.descrizioneAttivita.length}/200
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="regimeFiscale">Regime Fiscale *</Label>
                  <Select 
                    value={formData.regimeFiscale} 
                    onValueChange={(value: 'forfettario' | 'ordinario') => updateFormData('regimeFiscale', value)}
                  >
                    <SelectTrigger className={errors.regimeFiscale ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forfettario">Regime Forfettario</SelectItem>
                      <SelectItem value="ordinario">Regime Ordinario</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldFeedback 
                    error={errors.regimeFiscale?.message}
                    suggestion={getFieldSuggestion('regimeFiscale', formData.regimeFiscale)}
                  />
                </div>
                <div>
                  <Label htmlFor="dataInizio">Data Inizio Attività *</Label>
                  <Input
                    id="dataInizio"
                    type="date"
                    value={formData.dataInizio}
                    {...createFieldHandlers('dataInizio')}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className={errors.dataInizio ? 'border-red-500' : ''}
                    required
                  />
                  <FieldFeedback 
                    error={errors.dataInizio?.message}
                    success={!!formData.dataInizio && !errors.dataInizio}
                  />
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