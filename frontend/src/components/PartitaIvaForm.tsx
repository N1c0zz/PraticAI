'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Download, FileText, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PartitaIvaFormData {
  nome: string
  cognome: string
  codiceFiscale: string
  indirizzo: string
  civico: string
  cap: string
  comune: string
  provincia: string
  codiceAteco: string
  descrizioneAttivita: string
  regimeFiscale: 'forfettario' | 'ordinario'
  dataInizio: string
  email: string
  telefono: string
}

interface ApiResponse {
  success: boolean
  guida: string
  pdfUrl?: string
  error?: string
}

export default function PartitaIvaForm() {
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

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string>('')

  const handleInputChange = (field: keyof PartitaIvaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data: ApiResponse = await response.json()
      
      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || 'Errore durante la generazione')
      }
    } catch (err) {
      setError('Errore di connessione. Riprova più tardi.')
    } finally {
      setLoading(false)
    }
  }

  const downloadPdf = () => {
    if (result?.pdfUrl) {
      const link = document.createElement('a')
      link.href = result.pdfUrl
      link.download = `modulo_aa912_${formData.cognome}_${formData.nome}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Apertura Partita IVA - Freelance
        </h1>
        <p className="text-gray-600">
          Compila il form per generare automaticamente il modulo AA9/12 e ricevere una guida personalizzata
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Dati per l'apertura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dati personali */}
              <div className="grid grid-cols-2 gap-4">
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
                  required
                />
              </div>

              {/* Residenza */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="indirizzo">Indirizzo *</Label>
                  <Input
                    id="indirizzo"
                    value={formData.indirizzo}
                    onChange={(e) => handleInputChange('indirizzo', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="civico">Civico *</Label>
                  <Input
                    id="civico"
                    value={formData.civico}
                    onChange={(e) => handleInputChange('civico', e.target.value)}
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comune">Comune *</Label>
                  <Input
                    id="comune"
                    value={formData.comune}
                    onChange={(e) => handleInputChange('comune', e.target.value)}
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
                    required
                  />
                </div>
              </div>

              {/* Contatti */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                  />
                </div>
              </div>

              {/* Attività */}
              <div>
                <Label htmlFor="codiceAteco">Codice ATECO *</Label>
                <Input
                  id="codiceAteco"
                  value={formData.codiceAteco}
                  onChange={(e) => handleInputChange('codiceAteco', e.target.value)}
                  placeholder="es. 62.01.00"
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

              <div>
                <Label htmlFor="regimeFiscale">Regime Fiscale *</Label>
                <Select value={formData.regimeFiscale} onValueChange={(value: 'forfettario' | 'ordinario') => handleInputChange('regimeFiscale', value)}>
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

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generazione in corso...
                  </>
                ) : (
                  'Genera Modulo e Guida'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Risultati */}
        {result && (
          <div className="space-y-6">
            {/* Download PDF */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Modulo AA9/12 Generato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Il modulo è stato generato con i tuoi dati. Scaricalo e presentalo all'Agenzia delle Entrate.
                </p>
                <Button onClick={downloadPdf} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Scarica Modulo AA9/12
                </Button>
              </CardContent>
            </Card>

            {/* Guida AI */}
            <Card>
              <CardHeader>
                <CardTitle>🤖 Guida Personalizzata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {result.guida}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}