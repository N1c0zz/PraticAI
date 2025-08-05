from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from typing import Optional
import os
import uuid
from datetime import datetime

from services.pdf_generator import generate_autocertificazione_stato_civile_pdf
from ai.pipeline import generate_autocertificazione_stato_civile_guide
from models.schemas import AutocertificazioneStatoCivileRequest

router = APIRouter()

# Dizionario per tracciare i file generati
generated_files = {}

@router.post("/autocertificazione-stato-civile")
async def generate_autocertificazione_stato_civile_documents(
    request: AutocertificazioneStatoCivileRequest,
    background_tasks: BackgroundTasks
):
    """
    Generate Autocertificazione di Stato Civile PDF and AI guide
    """
    try:
        print(f"🚀 Inizio generazione Autocertificazione Stato Civile per: {request.nome} {request.cognome}")
        
        # Validazione aggiuntiva per campi condizionali
        validation_error = validate_conditional_fields(request)
        if validation_error:
            raise HTTPException(status_code=422, detail=validation_error)
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        pdf_filename = f"autocertificazione_stato_civile_{request.cognome}_{request.nome}_{file_id}.pdf"
        pdf_path = os.path.join("data", "output", pdf_filename)
        
        print(f"📁 File ID: {file_id}")
        print(f"📄 PDF path: {pdf_path}")
        
        # Ensure output directory exists
        output_dir = os.path.dirname(pdf_path)
        os.makedirs(output_dir, exist_ok=True)
        print(f"✅ Directory creata: {output_dir}")
        
        # Generate PDF
        print("🔧 Generazione PDF Autocertificazione Stato Civile...")
        pdf_success = generate_autocertificazione_stato_civile_pdf(request.dict(), pdf_path)
        
        if not pdf_success:
            print("❌ Errore nella generazione PDF")
            raise HTTPException(status_code=500, detail="Errore nella generazione del PDF")
        
        # Verifica che il PDF sia stato creato
        if not os.path.exists(pdf_path):
            print(f"❌ File PDF non trovato dopo generazione: {pdf_path}")
            raise HTTPException(status_code=500, detail="PDF non generato correttamente")
        
        # Salva il mapping file_id -> path
        generated_files[file_id] = pdf_path
        print(f"💾 File mappato: {file_id} -> {pdf_path}")
        print(f"📋 File attualmente mappati: {list(generated_files.keys())}")
        
        # Generate AI guide
        print("🤖 Generazione guida AI...")
        ai_guide = generate_autocertificazione_stato_civile_guide(request.dict())
        if not ai_guide:
            ai_guide = "Guida AI non disponibile. L'autocertificazione di stato civile è stata generata correttamente."
        
        # Schedule file cleanup after 1 hour (commented for now)
        # background_tasks.add_task(cleanup_file, file_id)
        
        print("✅ Generazione Autocertificazione Stato Civile completata con successo!")
        
        return {
            "success": True,
            "guida": ai_guide,
            "pdfUrl": f"/api/download/{file_id}",
            "message": "Autocertificazione di stato civile generata con successo"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Errore completo: {e}")
        raise HTTPException(status_code=500, detail=f"Errore interno: {str(e)}")

def validate_conditional_fields(request: AutocertificazioneStatoCivileRequest) -> Optional[str]:
    """
    Valida i campi condizionali in base allo stato civile
    """
    if request.statoCivile == 'coniugato':
        if not request.nomeConiuge or not request.cognomeConiuge:
            return "Per lo stato 'coniugato' sono richiesti nome e cognome del coniuge"
        if not request.dataMatrimonio:
            return "Per lo stato 'coniugato' è richiesta la data del matrimonio"
        if not request.comuneMatrimonio:
            return "Per lo stato 'coniugato' è richiesto il comune del matrimonio"
    
    elif request.statoCivile == 'separato':
        if not request.dataSeparazione:
            return "Per lo stato 'separato' è richiesta la data di separazione"
        if not request.tribunaleCompetente:
            return "Per lo stato 'separato' è richiesto il tribunale competente"
    
    elif request.statoCivile == 'divorziato':
        if not request.dataDivorzio:
            return "Per lo stato 'divorziato' è richiesta la data di divorzio"
        if not request.tribunaleCompetente:
            return "Per lo stato 'divorziato' è richiesto il tribunale competente"
    
    elif request.statoCivile == 'vedovo':
        if not request.dataDecesso:
            return "Per lo stato 'vedovo' è richiesta la data di decesso del coniuge"
    
    return None

@router.get("/download/{file_id}")
async def download_autocertificazione_stato_civile_pdf(file_id: str):
    """
    Download generated Autocertificazione di Stato Civile PDF file
    """
    print(f"📥 Richiesta download per file_id: {file_id}")
    print(f"📋 File disponibili: {list(generated_files.keys())}")
    
    # Cerca nel dizionario dei file generati
    if file_id in generated_files:
        file_path = generated_files[file_id]
        print(f"✅ File trovato nel mapping: {file_path}")
        
        if os.path.exists(file_path):
            filename = os.path.basename(file_path)
            print(f"📄 Invio file: {filename}")
            return FileResponse(
                file_path,
                media_type='application/pdf',
                filename=filename
            )
        else:
            print(f"❌ File non esiste nel filesystem: {file_path}")
    else:
        print(f"❌ File_id non trovato nel mapping")
    
    # Fallback: cerca nella directory output
    output_dir = os.path.join("data", "output")
    print(f"🔍 Cerco nella directory: {output_dir}")
    
    if os.path.exists(output_dir):
        files_in_dir = os.listdir(output_dir)
        print(f"📁 File nella directory: {files_in_dir}")
        
        for filename in files_in_dir:
            if file_id in filename and filename.endswith('.pdf'):
                file_path = os.path.join(output_dir, filename)
                print(f"✅ File trovato nel fallback: {file_path}")
                if os.path.exists(file_path):
                    return FileResponse(
                        file_path,
                        media_type='application/pdf',
                        filename=filename
                    )
    else:
        print(f"❌ Directory output non esiste: {output_dir}")
    
    print("❌ File non trovato da nessuna parte")
    raise HTTPException(status_code=404, detail=f"File non trovato: {file_id}")

async def cleanup_file(file_id: str):
    """
    Clean up generated files after some time
    """
    try:
        if file_id in generated_files:
            file_path = generated_files[file_id]
            if os.path.exists(file_path):
                os.remove(file_path)
            del generated_files[file_id]
    except Exception:
        pass  # Ignore cleanup errors