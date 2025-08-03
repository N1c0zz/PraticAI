// frontend/src/hooks/useApi.ts

import { useState, useCallback } from 'react'
import { ApiError } from '@/types/api'

/**
 * Custom hook per gestire chiamate API con loading e error states
 */
export function useApi<TRequest, TResponse>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TResponse | null>(null)

  const execute = useCallback(async (
    apiCall: (request: TRequest) => Promise<TResponse>,
    request: TRequest
  ): Promise<TResponse | null> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await apiCall(request)
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'Errore imprevisto. Riprova più tardi.'
      
      setError(errorMessage)
      setData(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset
  }
}

/**
 * Hook specifico per Partita IVA
 */
import type { PartitaIvaRequest, PartitaIvaResponse } from '@/types/api'

export function usePartitaIva() {
  const { loading, error, data, execute, reset } = useApi<PartitaIvaRequest, PartitaIvaResponse>()

  const generatePartitaIva = useCallback(async (formData: PartitaIvaRequest) => {
    const { apiClient } = await import('@/lib/api')
    return execute(apiClient.generatePartitaIva.bind(apiClient), formData)
  }, [execute])

  return {
    loading,
    error,
    result: data,
    generatePartitaIva,
    reset
  }
}

/**
 * Hook per download PDF
 */
export function useDownload() {
  const [downloading, setDownloading] = useState(false)

  const downloadPdf = useCallback(async (fileId: string, filename: string) => {
    try {
      setDownloading(true)
      const { apiClient } = await import('@/lib/api')
      
      const blob = await apiClient.downloadPdf(fileId)
      
      // Crea link temporaneo per download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Errore download:', error)
    } finally {
      setDownloading(false)
    }
  }, [])

  return { downloadPdf, downloading }
}