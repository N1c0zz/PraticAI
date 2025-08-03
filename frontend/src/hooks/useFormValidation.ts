// frontend/src/hooks/useFormValidation.ts

import { useState, useCallback } from 'react'
import { z } from 'zod'
import { 
  partitaIvaSchema, 
  PartitaIvaFormData, 
  validateField,
  formatCodiceFiscale,
  formatCAP,
  formatCivico,
  formatProvincia,
  formatCodiceAteco
} from '@/lib/validations'

interface FieldError {
  message: string
  type: 'error' | 'warning' | 'success'
}

interface ValidationState {
  [key: string]: FieldError | null
}

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationState>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // Marca un campo come "toccato" dall'utente
  const markFieldAsTouched = useCallback((fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName))
  }, [])

  // Validazione real-time di un singolo campo
  const validateSingleField = useCallback((
    fieldName: keyof PartitaIvaFormData, 
    value: any,
    showErrors: boolean = true
  ) => {
    const validation = validateField(fieldName, value)
    
    if (showErrors && touchedFields.has(fieldName)) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: validation.isValid 
          ? null 
          : { message: validation.error || 'Errore', type: 'error' }
      }))
    }
    
    return validation
  }, [touchedFields])

  // Validazione completa del form
  const validateForm = useCallback((data: Partial<PartitaIvaFormData>) => {
    try {
      partitaIvaSchema.parse(data)
      return { isValid: true, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: ValidationState = {}
        error.issues.forEach(err => {
          const fieldName = err.path[0] as string
          formErrors[fieldName] = { 
            message: err.message, 
            type: 'error' 
          }
        })
        setErrors(formErrors)
        return { isValid: false, errors: formErrors }
      }
      return { isValid: false, errors: {} }
    }
  }, [])

  // Auto-formattazione dei campi
  const formatField = useCallback((
    fieldName: keyof PartitaIvaFormData, 
    value: string
  ): string => {
    switch (fieldName) {
      case 'codiceFiscale':
        return formatCodiceFiscale(value)
      case 'cap':
        return formatCAP(value)
      case 'civico':
        return formatCivico(value)
      case 'provincia':
        return formatProvincia(value)
      case 'codiceAteco':
        return formatCodiceAteco(value)
      default:
        return value
    }
  }, [])

  // Handler per input con validazione e formattazione
  const createFieldHandler = useCallback((
    fieldName: keyof PartitaIvaFormData,
    setValue: (value: string) => void,
    validateOnChange: boolean = true
  ) => {
    return (value: string) => {
      // 1. Formatta il valore
      const formattedValue = formatField(fieldName, value)
      
      // 2. Aggiorna il valore
      setValue(formattedValue)
      
      // 3. Valida se richiesto
      if (validateOnChange) {
        validateSingleField(fieldName, formattedValue, true)
      }
    }
  }, [formatField, validateSingleField])

  // Handler per blur (quando l'utente esce dal campo)
  const createBlurHandler = useCallback((
    fieldName: keyof PartitaIvaFormData,
    value: any
  ) => {
    return () => {
      markFieldAsTouched(fieldName)
      validateSingleField(fieldName, value, true)
    }
  }, [markFieldAsTouched, validateSingleField])

  // Suggerimenti intelligenti
  const getFieldSuggestion = useCallback((
    fieldName: keyof PartitaIvaFormData,
    value: any
  ): string | null => {
    switch (fieldName) {
      case 'codiceFiscale':
        if (value && value.length < 16) {
          return `Inserisci ${16 - value.length} caratteri rimanenti`
        }
        break
      case 'codiceAteco':
        if (!value) {
          return 'Non conosci il codice? Cerca su codiceateco.it'
        }
        break
      case 'regimeFiscale':
        if (value === 'forfettario') {
          return 'Aliquota 5% o 15% - Fatturato max €85.000'
        } else if (value === 'ordinario') {
          return 'Aliquote ordinarie - Nessun limite di fatturato'
        }
        break
      default:
        return null
    }
    return null
  }, [])

  // Reset errori
  const clearErrors = useCallback(() => {
    setErrors({})
    setTouchedFields(new Set())
  }, [])

  return {
    errors,
    touchedFields,
    validateSingleField,
    validateForm,
    formatField,
    createFieldHandler,
    createBlurHandler,
    getFieldSuggestion,
    clearErrors,
    markFieldAsTouched
  }
}