// frontend/src/hooks/useAutocertificazioneNascita.ts

import { useState, useCallback } from 'react'
import { ApiError } from '@/types/api'
import type { AutocertificazioneNascitaRequest, AutocertificazioneNascitaResponse } from '@/types/api'

/**
 * Hook specifico per Autocertificazione di Nascita
 */
export function useAutocertificazioneNascita() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AutocertificazioneNascitaResponse | null>(null)

  const generateAutocertificazioneNascita = useCallback(async (formData: AutocertificazioneNascitaRequest) => {
    try {
      setLoading(true)
      setError(null)
      
      const { apiClient } = await import('@/lib/api')
      const response = await apiClient.generateAutocertificazioneNascita(formData)
      
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
    generateAutocertificazioneNascita,
    reset
  }
}