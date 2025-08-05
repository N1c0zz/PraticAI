from openai import OpenAI
import os
from typing import Dict, Any, Optional
from datetime import datetime

def get_openai_client():
    """Get OpenAI client with proper error handling"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("⚠️  OPENAI_API_KEY non trovata nel file .env")
        return None
    return OpenAI(api_key=api_key)

def generate_partita_iva_guide(data: Dict[str, Any]) -> Optional[str]:
    """
    Generate personalized Partita IVA opening guide using GPT-4
    """
    try:
        # Get OpenAI client
        client = get_openai_client()
        if not client:
            return "⚠️ Guida AI non disponibile: API key mancante. Il modulo AA9/12 è stato generato correttamente."
        
        from ai.prompts.partita_iva import PARTITA_IVA_PROMPT
        
        # Format prompt with user data
        formatted_prompt = PARTITA_IVA_PROMPT.format(
            nome=data.get('nome', ''),
            cognome=data.get('cognome', ''),
            codiceFiscale=data.get('codiceFiscale', ''),
            indirizzo=data.get('indirizzo', ''),
            civico=data.get('civico', ''),
            cap=data.get('cap', ''),
            comune=data.get('comune', ''),
            provincia=data.get('provincia', ''),
            email=data.get('email', ''),
            telefono=data.get('telefono', 'Non fornito'),
            codiceAteco=data.get('codiceAteco', ''),
            descrizioneAttivita=data.get('descrizioneAttivita', ''),
            regimeFiscale=data.get('regimeFiscale', ''),
            dataInizio=format_date_for_prompt(data.get('dataInizio', ''))
        )
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "Sei un esperto consulente fiscale italiano specializzato in adempimenti per freelance e microimprese. Rispondi sempre in italiano con informazioni accurate e aggiornate."
                },
                {
                    "role": "user",
                    "content": formatted_prompt
                }
            ],
            max_tokens=2000,
            temperature=0.3
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Errore nella generazione della guida AI: {e}")
        return f"⚠️ Guida AI non disponibile: {str(e)}. Il modulo AA9/12 è stato generato correttamente."

def generate_autocertificazione_guide(data: Dict[str, Any]) -> Optional[str]:
    """
    Generate personalized Autocertificazione guide using GPT-4
    """
    try:
        # Get OpenAI client
        client = get_openai_client()
        if not client:
            return "⚠️ Guida AI non disponibile: API key mancante. L'autocertificazione è stata generata correttamente."
        
        from ai.prompts.autocertificazione import AUTOCERTIFICAZIONE_PROMPT
        
        # Format prompt with user data
        formatted_prompt = AUTOCERTIFICAZIONE_PROMPT.format(
            nome=data.get('nome', ''),
            cognome=data.get('cognome', ''),
            codiceFiscale=data.get('codiceFiscale', ''),
            luogoNascita=data.get('luogoNascita', ''),
            dataNascita=format_date_for_prompt(data.get('dataNascita', '')),
            comuneResidenza=data.get('comuneResidenza', ''),
            indirizzoResidenza=data.get('indirizzoResidenza', ''),
            motivoRichiesta=data.get('motivoRichiesta', 'Non specificato')
        )
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "Sei un esperto consulente di pratiche burocratiche italiane specializzato in autocertificazioni. Rispondi sempre in italiano con informazioni accurate e aggiornate sulla normativa italiana."
                },
                {
                    "role": "user",
                    "content": formatted_prompt
                }
            ],
            max_tokens=2000,
            temperature=0.3
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Errore nella generazione della guida AI per Autocertificazione: {e}")
        return f"⚠️ Guida AI non disponibile: {str(e)}. L'autocertificazione è stata generata correttamente."

def generate_autocertificazione_nascita_guide(data: Dict[str, Any]) -> Optional[str]:
    """
    Generate personalized Autocertificazione di Nascita guide using GPT-4
    """
    try:
        # Get OpenAI client
        client = get_openai_client()
        if not client:
            return "⚠️ Guida AI non disponibile: API key mancante. L'autocertificazione di nascita è stata generata correttamente."
        
        from ai.prompts.autocertificazione_nascita import AUTOCERTIFICAZIONE_NASCITA_PROMPT
        
        # Format prompt with user data
        formatted_prompt = AUTOCERTIFICAZIONE_NASCITA_PROMPT.format(
            nomeDichiarante=data.get('nomeDichiarante', ''),
            cognomeDichiarante=data.get('cognomeDichiarante', ''),
            codiceFiscaleDichiarante=data.get('codiceFiscaleDichiarante', ''),
            nomeNato=data.get('nomeNato', ''),
            cognomeNato=data.get('cognomeNato', ''),
            dataNascita=format_date_for_prompt(data.get('dataNascita', '')),
            luogoNascita=data.get('luogoNascita', ''),
            provinciaNascita=data.get('provinciaNascita', ''),
            ospedale=data.get('ospedale', 'Non specificato'),
            motivoRichiesta=data.get('motivoRichiesta', 'Non specificato')
        )
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "Sei un esperto consulente di pratiche burocratiche italiane specializzato in autocertificazioni di nascita. Rispondi sempre in italiano con informazioni accurate e aggiornate sulla normativa italiana."
                },
                {
                    "role": "user",
                    "content": formatted_prompt
                }
            ],
            max_tokens=2000,
            temperature=0.3
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Errore nella generazione della guida AI per Autocertificazione di Nascita: {e}")
        return f"⚠️ Guida AI non disponibile: {str(e)}. L'autocertificazione di nascita è stata generata correttamente."

def generate_autocertificazione_stato_civile_guide(data: Dict[str, Any]) -> Optional[str]:
    """
    Generate personalized Autocertificazione di Stato Civile guide using GPT-4
    """
    try:
        # Get OpenAI client
        client = get_openai_client()
        if not client:
            return "⚠️ Guida AI non disponibile: API key mancante. L'autocertificazione di stato civile è stata generata correttamente."
        
        from ai.prompts.autocertificazione_stato_civile import AUTOCERTIFICAZIONE_STATO_CIVILE_PROMPT
        
        # Prepare additional data based on civil status
        stato_civile = data.get('statoCivile', '')
        dati_aggiuntivi = []
        
        if stato_civile == 'coniugato':
            if data.get('nomeConiuge') and data.get('cognomeConiuge'):
                dati_aggiuntivi.append(f"Coniuge: {data.get('nomeConiuge')} {data.get('cognomeConiuge')}")
            if data.get('dataMatrimonio'):
                dati_aggiuntivi.append(f"Data matrimonio: {format_date_for_prompt(data.get('dataMatrimonio'))}")
            if data.get('comuneMatrimonio'):
                dati_aggiuntivi.append(f"Comune matrimonio: {data.get('comuneMatrimonio')}")
        
        elif stato_civile == 'separato':
            if data.get('dataSeparazione'):
                dati_aggiuntivi.append(f"Data separazione: {format_date_for_prompt(data.get('dataSeparazione'))}")
            if data.get('tribunaleCompetente'):
                dati_aggiuntivi.append(f"Tribunale competente: {data.get('tribunaleCompetente')}")
        
        elif stato_civile == 'divorziato':
            if data.get('dataDivorzio'):
                dati_aggiuntivi.append(f"Data divorzio: {format_date_for_prompt(data.get('dataDivorzio'))}")
            if data.get('tribunaleCompetente'):
                dati_aggiuntivi.append(f"Tribunale competente: {data.get('tribunaleCompetente')}")
        
        elif stato_civile == 'vedovo':
            if data.get('dataDecesso'):
                dati_aggiuntivi.append(f"Data decesso coniuge: {format_date_for_prompt(data.get('dataDecesso'))}")
        
        # Format stato civile for display
        stato_civile_display = {
            'celibe_nubile': 'Celibe/Nubile',
            'coniugato': 'Coniugato/a',
            'separato': 'Separato/a',
            'divorziato': 'Divorziato/a',
            'vedovo': 'Vedovo/a'
        }.get(stato_civile, stato_civile)
        
        # Format prompt with user data
        formatted_prompt = AUTOCERTIFICAZIONE_STATO_CIVILE_PROMPT.format(
            nome=data.get('nome', ''),
            cognome=data.get('cognome', ''),
            codiceFiscale=data.get('codiceFiscale', ''),
            luogoNascita=data.get('luogoNascita', ''),
            dataNascita=format_date_for_prompt(data.get('dataNascita', '')),
            comuneResidenza=data.get('comuneResidenza', ''),
            indirizzoResidenza=data.get('indirizzoResidenza', ''),
            statoCivile=stato_civile_display,
            datiAggiuntivi='; '.join(dati_aggiuntivi) if dati_aggiuntivi else 'Nessun dato aggiuntivo',
            motivoRichiesta=data.get('motivoRichiesta', 'Non specificato')
        )
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": "Sei un esperto consulente di pratiche burocratiche italiane specializzato in autocertificazioni di stato civile. Rispondi sempre in italiano con informazioni accurate e aggiornate sulla normativa italiana."
                },
                {
                    "role": "user",
                    "content": formatted_prompt
                }
            ],
            max_tokens=2500,
            temperature=0.3
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Errore nella generazione della guida AI per Autocertificazione di Stato Civile: {e}")
        return f"⚠️ Guida AI non disponibile: {str(e)}. L'autocertificazione di stato civile è stata generata correttamente."

def format_date_for_prompt(date_string: str) -> str:
    """
    Format date for better readability in prompt
    """
    try:
        if date_string:
            date_obj = datetime.strptime(date_string, '%Y-%m-%d')
            return date_obj.strftime('%d/%m/%Y')
    except ValueError:
        pass
    return date_string