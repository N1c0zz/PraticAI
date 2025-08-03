"""
Pydantic models for request/response schemas
"""

from pydantic import BaseModel, EmailStr, validator
from typing import Literal, Optional
from datetime import date

class PartitaIvaRequest(BaseModel):
    nome: str
    cognome: str
    codiceFiscale: str
    indirizzo: str
    civico: str
    cap: str
    comune: str
    provincia: str
    codiceAteco: str
    descrizioneAttivita: str
    regimeFiscale: Literal['forfettario', 'ordinario']
    dataInizio: str  # Format: YYYY-MM-DD
    email: EmailStr
    telefono: Optional[str] = None
    
    @validator('codiceFiscale')
    def validate_codice_fiscale(cls, v):
        v = v.upper().strip()
        if len(v) != 16:
            raise ValueError('Il codice fiscale deve essere di 16 caratteri')
        return v
    
    @validator('cap')
    def validate_cap(cls, v):
        if len(v) != 5 or not v.isdigit():
            raise ValueError('Il CAP deve essere di 5 cifre')
        return v
    
    @validator('provincia')
    def validate_provincia(cls, v):
        v = v.upper().strip()
        if len(v) != 2:
            raise ValueError('La provincia deve essere di 2 caratteri')
        return v

class GenerateResponse(BaseModel):
    success: bool
    guida: Optional[str] = None
    pdfUrl: Optional[str] = None
    error: Optional[str] = None
    message: Optional[str] = None