// frontend/src/lib/api.ts

import { 
  PartitaIvaRequest, 
  PartitaIvaResponse, 
  AutocertificazioneRequest,
  AutocertificazioneResponse,
  ApiError, 
  ApiCallOptions,
  BaseApiResponse 
} from '@/types/api'

/**
 * Client API centralizzato per PraticAI
 * Gestisce tutte le chiamate al backend con error handling uniforme
 */
class PraticAIApiClient {
  private baseUrl: string
  private defaultTimeout: number = 30000 // 30 secondi

  constructor() {
    // In produzione sarà l'URL del tuo backend
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
  }

  /**
   * Metodo base per tutte le chiamate HTTP
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit & ApiCallOptions = {}
  ): Promise<T> {
    const { retries = 2, timeout = this.defaultTimeout, ...fetchOptions } = options

    // Setup AbortController per timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })

      clearTimeout(timeoutId)

      // Parse response
      let data: any
      try {
        data = await response.json()
      } catch {
        // Se non è JSON, probabilmente è un errore del server
        throw new ApiError(
          `Errore del server (${response.status})`,
          response.status
        )
      }

      // Check se la risposta è ok
      if (!response.ok) {
        throw new ApiError(
          data.error || data.message || `HTTP Error ${response.status}`,
          response.status,
          data
        )
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)

      // Gestione errori specifici
      if (error instanceof ApiError) {
        throw error
      }

      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError') {
        throw new ApiError('Timeout: La richiesta ha impiegato troppo tempo', 408)
      }

      if (!navigator.onLine) {
        throw new ApiError('Nessuna connessione internet', 0)
      }

      // Retry logic per errori di rete
      if (retries > 0 && this.shouldRetry(error)) {
        console.log(`Riprovo chiamata API... (${retries} tentativi rimasti)`)
        await this.delay(1000) // Aspetta 1 secondo
        return this.request(endpoint, { ...options, retries: retries - 1 })
      }

      throw new ApiError(
        'Errore di connessione. Verifica la tua connessione internet.',
        0
      )
    }
  }

  /**
   * Determina se un errore è da riprovare
   */
  private shouldRetry(error: any): boolean {
    // Riprova per errori di rete temporanei
    return (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT' ||
      !error.status || // Errori senza status code sono solitamente di rete
      error.status >= 500 // Server errors
    )
  }

  /**
   * Delay utility per retry
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // ===== METODI API SPECIFICI =====

  /**
   * Genera documenti per Partita IVA
   */
  async generatePartitaIva(data: PartitaIvaRequest): Promise<PartitaIvaResponse> {
    return this.request<PartitaIvaResponse>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Genera autocertificazione di residenza
   */
  async generateAutocertificazione(data: AutocertificazioneRequest): Promise<AutocertificazioneResponse> {
    return this.request<AutocertificazioneResponse>('/api/autocertificazione', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Scarica PDF generato
   */
  async downloadPdf(fileId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/download/${fileId}`)
    
    if (!response.ok) {
      throw new ApiError(`Errore download: ${response.status}`, response.status)
    }

    return response.blob()
  }

  /**
   * Verifica salute del backend
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health')
  }

  // ===== METODI FUTURI =====

  /**
   * Genera documenti ISEE (futuro)
   */
  async generateIsee(data: any): Promise<any> {
    // TODO: implementare quando aggiungiamo ISEE
    return this.request('/api/isee', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Lista documenti generati (futuro - con database)
   */
  async getUserDocuments(): Promise<any[]> {
    // TODO: implementare quando aggiungiamo il database
    return this.request('/api/user/documents')
  }
}

// Esporta istanza singleton
export const apiClient = new PraticAIApiClient()

// Export anche la classe per testing
export { PraticAIApiClient }