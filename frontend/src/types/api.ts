// ===== RICHIESTE API =====

export interface PartitaIvaRequest {
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
  telefono?: string
}

export interface AutocertificazioneRequest {
  nome: string
  cognome: string
  codiceFiscale: string
  luogoNascita: string
  dataNascita: string
  comuneResidenza: string
  indirizzoResidenza: string
  motivoRichiesta?: string
}

// Futuri tipi per altre pratiche
export interface IseeRequest {
  // TODO: quando implementiamo ISEE
  nome: string
  cognome: string
  // ... altri campi
}

// ===== RISPOSTE API =====

export interface BaseApiResponse {
  success: boolean
  message?: string
  error?: string
}

export interface PartitaIvaResponse extends BaseApiResponse {
  guida?: string
  pdfUrl?: string
}

export interface AutocertificazioneResponse extends BaseApiResponse {
  guida?: string
  pdfUrl?: string
}

export interface IseeResponse extends BaseApiResponse {
  // TODO: quando implementiamo ISEE
  guida?: string
  pdfUrl?: string
}

// ===== ERRORI API =====

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ===== UTILITY TYPES =====

export type ApiEndpoint = 
  | '/api/generate'              // Partita IVA
  | '/api/autocertificazione'    // Autocertificazione
  | '/api/isee'                  // ISEE (futuro)
  | '/api/cud'                   // CUD (futuro)

export interface ApiCallOptions {
  retries?: number
  timeout?: number
  signal?: AbortSignal
}