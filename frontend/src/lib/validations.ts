// frontend/src/lib/validations.ts

import { z } from 'zod'

// Utility per validare codice fiscale
function validateCodiceFiscale(cf: string): boolean {
  if (cf.length !== 16) return false
  
  const cfRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/
  if (!cfRegex.test(cf)) return false
  
  // Controllo carattere di controllo
  const oddMap = 'BAFHJNPRTVCESULDGIMOQKWZYX'
  const evenMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const controlMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
  let sum = 0
  for (let i = 0; i < 15; i++) {
    const char = cf[i]
    if (i % 2 === 0) { // posizione dispari (1-based)
      const index = isNaN(Number(char)) ? char.charCodeAt(0) - 65 : Number(char)
      sum += oddMap.charCodeAt(index) - 65
    } else { // posizione pari
      const index = isNaN(Number(char)) ? char.charCodeAt(0) - 65 : Number(char)
      sum += index
    }
  }
  
  const expectedControl = controlMap[sum % 26]
  return cf[15] === expectedControl
}

// Schema principale per Partita IVA
export const partitaIvaSchema = z.object({
  // Dati personali
  nome: z
    .string()
    .min(1, "Nome richiesto")
    .min(2, "Il nome deve essere di almeno 2 caratteri")
    .max(50, "Il nome non può superare 50 caratteri")
    .regex(/^[a-zA-ZÀ-ÿ\s']+$/, "Il nome può contenere solo lettere, spazi e apostrofi"),
  
  cognome: z
    .string()
    .min(1, "Cognome richiesto")
    .min(2, "Il cognome deve essere di almeno 2 caratteri") 
    .max(50, "Il cognome non può superare 50 caratteri")
    .regex(/^[a-zA-ZÀ-ÿ\s']+$/, "Il cognome può contenere solo lettere, spazi e apostrofi"),
  
  codiceFiscale: z
    .string()
    .min(1, "Codice fiscale richiesto")
    .length(16, "Il codice fiscale deve essere di 16 caratteri")
    .refine(validateCodiceFiscale, "Codice fiscale non valido")
    .transform(val => val.toUpperCase()),
  
  // Residenza
  indirizzo: z
    .string()
    .min(1, "Indirizzo richiesto")
    .min(5, "Inserisci un indirizzo completo")
    .max(100, "L'indirizzo non può superare 100 caratteri"),
  
  civico: z
    .string()
    .min(1, "Numero civico richiesto")
    .max(10, "Numero civico troppo lungo")
    .regex(/^[0-9]+[A-Za-z]?$/, "Formato civico non valido (es. 123, 45A)"),
  
  cap: z
    .string()
    .min(1, "CAP richiesto")
    .length(5, "Il CAP deve essere di 5 cifre")
    .regex(/^[0-9]{5}$/, "Il CAP deve contenere solo numeri"),
  
  comune: z
    .string()
    .min(1, "Comune richiesto")
    .min(2, "Nome comune troppo corto")
    .max(50, "Nome comune troppo lungo")
    .regex(/^[a-zA-ZÀ-ÿ\s'.-]+$/, "Nome comune non valido"),
  
  provincia: z
    .string()
    .min(1, "Provincia richiesta")
    .length(2, "La provincia deve essere di 2 caratteri")
    .regex(/^[A-Z]{2}$/, "Formato provincia non valido (es. MI, RM)")
    .transform(val => val.toUpperCase()),
  
  // Contatti
  email: z
    .string()
    .min(1, "Email richiesta")
    .email("Formato email non valido")
    .max(100, "Email troppo lunga"),
  
  telefono: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[0-9\s\-\(\)]{8,15}$/.test(val),
      "Formato telefono non valido"
    ),
  
  // Attività
  codiceAteco: z
    .string()
    .min(1, "Codice ATECO richiesto")
    .regex(
      /^[0-9]{2}\.[0-9]{2}\.[0-9]{2}$/,
      "Formato ATECO non valido (es. 62.01.00)"
    ),
  
  descrizioneAttivita: z
    .string()
    .min(1, "Descrizione attività richiesta")
    .min(10, "Descrizione troppo breve (minimo 10 caratteri)")
    .max(200, "Descrizione troppo lunga (massimo 200 caratteri)"),
  
  regimeFiscale: z.enum(['forfettario', 'ordinario'], {
    message: "Seleziona un regime fiscale"
  }),
  
  dataInizio: z
    .string()
    .min(1, "Data inizio attività richiesta")
    .refine(
      (val) => {
        const date = new Date(val)
        const today = new Date()
        const maxDate = new Date()
        maxDate.setFullYear(today.getFullYear() + 1)
        
        return date >= today && date <= maxDate
      },
      "La data deve essere compresa tra oggi e un anno da oggi"
    )
})

// Tipo TypeScript inferito dallo schema
export type PartitaIvaFormData = z.infer<typeof partitaIvaSchema>

// Schema per validazione parziale (field-by-field)
export const partitaIvaPartialSchema = partitaIvaSchema.partial()

// Funzioni helper per validazione singoli campi
export const validateField = (field: keyof PartitaIvaFormData, value: any) => {
  try {
    const fieldSchema = partitaIvaSchema.shape[field]
    fieldSchema.parse(value)
    return { isValid: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0].message }
    }
    return { isValid: false, error: "Errore di validazione" }
  }
}

// Funzioni di auto-completamento/suggerimenti
export const formatCodiceFiscale = (value: string): string => {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16)
}

export const formatCAP = (value: string): string => {
  return value.replace(/[^0-9]/g, '').slice(0, 5)
}

export const formatCivico = (value: string): string => {
  return value.replace(/[^0-9A-Za-z]/g, '').slice(0, 10)
}

export const formatProvincia = (value: string): string => {
  return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2)
}

export const formatCodiceAteco = (value: string): string => {
  let formatted = value.replace(/[^0-9]/g, '')
  if (formatted.length > 2) {
    formatted = formatted.slice(0, 2) + '.' + formatted.slice(2)
  }
  if (formatted.length > 6) {
    formatted = formatted.slice(0, 6) + '.' + formatted.slice(6, 8)
  }
  return formatted.slice(0, 8)
}