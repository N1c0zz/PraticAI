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

class AutocertificazioneRequest(BaseModel):
    nome: str
    cognome: str
    codiceFiscale: str
    luogoNascita: str
    dataNascita: str  # Format: YYYY-MM-DD
    comuneResidenza: str
    indirizzoResidenza: str
    motivoRichiesta: Optional[str] = None
    
    @validator('codiceFiscale')
    def validate_codice_fiscale(cls, v):
        v = v.upper().strip()
        if len(v) != 16:
            raise ValueError('Il codice fiscale deve essere di 16 caratteri')
        return v
    
    @validator('dataNascita')
    def validate_data_nascita(cls, v):
        try:
            date.fromisoformat(v)
        except ValueError:
            raise ValueError('Formato data non valido. Utilizzare YYYY-MM-DD')
        return v

class AutocertificazioneNascitaRequest(BaseModel):
    # Dati del dichiarante
    nomeDichiarante: str
    cognomeDichiarante: str
    codiceFiscaleDichiarante: str
    
    # Dati del nato/nata
    nomeNato: str
    cognomeNato: str
    dataNascita: str  # Format: YYYY-MM-DD
    luogoNascita: str
    provinciaNascita: str
    ospedale: Optional[str] = None
    
    motivoRichiesta: Optional[str] = None
    
    @validator('codiceFiscaleDichiarante')
    def validate_codice_fiscale_dichiarante(cls, v):
        v = v.upper().strip()
        if len(v) != 16:
            raise ValueError('Il codice fiscale del dichiarante deve essere di 16 caratteri')
        return v
    
    @validator('provinciaNascita')
    def validate_provincia_nascita(cls, v):
        v = v.upper().strip()
        if len(v) != 2:
            raise ValueError('La provincia deve essere di 2 caratteri')
        return v
    
    @validator('dataNascita')
    def validate_data_nascita(cls, v):
        try:
            date_obj = date.fromisoformat(v)
            # Check if date is not in the future
            if date_obj > date.today():
                raise ValueError('La data di nascita non può essere futura')
        except ValueError as e:
            if 'format' in str(e).lower():
                raise ValueError('Formato data non valido. Utilizzare YYYY-MM-DD')
            raise e
        return v

class AutocertificazioneStatoCivileRequest(BaseModel):
    # Dati personali
    nome: str
    cognome: str
    codiceFiscale: str
    luogoNascita: str
    dataNascita: str  # Format: YYYY-MM-DD
    comuneResidenza: str
    indirizzoResidenza: str
    
    # Stato civile
    statoCivile: Literal['celibe_nubile', 'coniugato', 'separato', 'divorziato', 'vedovo']
    
    # Dati aggiuntivi condizionali (opzionali)
    nomeConiuge: Optional[str] = None
    cognomeConiuge: Optional[str] = None
    dataMatrimonio: Optional[str] = None  # Format: YYYY-MM-DD
    comuneMatrimonio: Optional[str] = None
    dataSeparazione: Optional[str] = None  # Format: YYYY-MM-DD
    dataDivorzio: Optional[str] = None  # Format: YYYY-MM-DD
    tribunaleCompetente: Optional[str] = None
    dataDecesso: Optional[str] = None  # Format: YYYY-MM-DD
    
    motivoRichiesta: Optional[str] = None
    
    @validator('codiceFiscale')
    def validate_codice_fiscale(cls, v):
        v = v.upper().strip()
        if len(v) != 16:
            raise ValueError('Il codice fiscale deve essere di 16 caratteri')
        return v
    
    @validator('dataNascita')
    def validate_data_nascita(cls, v):
        try:
            date_obj = date.fromisoformat(v)
            if date_obj > date.today():
                raise ValueError('La data di nascita non può essere futura')
        except ValueError as e:
            if 'format' in str(e).lower():
                raise ValueError('Formato data non valido. Utilizzare YYYY-MM-DD')
            raise e
        return v
    
    @validator('dataMatrimonio', 'dataSeparazione', 'dataDivorzio', 'dataDecesso')
    def validate_date_fields(cls, v):
        if v is not None:
            try:
                date_obj = date.fromisoformat(v)
                if date_obj > date.today():
                    raise ValueError('Le date non possono essere future')
            except ValueError as e:
                if 'format' in str(e).lower():
                    raise ValueError('Formato data non valido. Utilizzare YYYY-MM-DD')
                raise e
        return v
    
    @validator('statoCivile')
    def validate_stato_civile_requirements(cls, v, values):
        # Non possiamo fare validazioni incrociate complete qui poiché
        # i campi potrebbero non essere ancora tutti processati
        # La validazione più complessa sarà fatta nel route handler
        return v

class GenerateResponse(BaseModel):
    success: bool
    guida: Optional[str] = None
    pdfUrl: Optional[str] = None
    error: Optional[str] = None
    message: Optional[str] = None