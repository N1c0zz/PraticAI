// frontend/src/hooks/useAutocertificazioneStatoCivile.ts

import { useState, useCallback } from 'react'
import { ApiError } from '@/types/api'
import type { AutocertificazioneStatoCivileRequest, AutocertificazioneStatoCivileResponse } from '@/types/api'

/**
 * Hook specifico per Autocertificazione di Stato Civile
 */
export function useAutocertificazioneStatoCivile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AutocertificazioneStatoCivileResponse | null>(null)

  const generateAutocertificazioneStatoCivile = useCallback(async (formData: AutocertificazioneStatoCivileRequest) => {
    try {
      setLoading(true)
      setError(null)
      
      const { apiClient } = await import('@/lib/api')
      const response = await apiClient.generateAutocertificazioneStatoCivile(formData)
      
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
    generateAutocertificazioneStatoCivile,
    reset
  }
}