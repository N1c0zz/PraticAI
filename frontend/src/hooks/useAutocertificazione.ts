// frontend/src/hooks/useAutocertificazione.ts

import { useState, useCallback } from 'react'
import { ApiError } from '@/types/api'
import type { AutocertificazioneRequest, AutocertificazioneResponse } from '@/types/api'

/**
 * Hook specifico per Autocertificazione di Residenza
 */
export function useAutocertificazione() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AutocertificazioneResponse | null>(null)

  const generateAutocertificazione = useCallback(async (formData: AutocertificazioneRequest) => {
    try {
      setLoading(true)
      setError(null)
      
      const { apiClient } = await import('@/lib/api')
      const response = await apiClient.generateAutocertificazione(formData)
      
      setResult(response)
      return response
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Errore imprevisto. Riprova più tardi.'
      
      setError(errorMessage)
      setResult(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setResult(null)
  }, [])

  return {
    loading,
    error,
    result,
    generateAutocertificazione,
    reset
  }
}