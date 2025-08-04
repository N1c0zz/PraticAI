from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from typing import Optional
import os
import uuid
from datetime import datetime

from services.pdf_generator import generate_autocertificazione_pdf
from ai.pipeline import generate_autocertificazione_guide
from models.schemas import AutocertificazioneRequest

router = APIRouter()

# Dizionario per tracciare i file generati
generated_files = {}

@router.post("/autocertificazione")
async def generate_autocertificazione_documents(
    request: AutocertificazioneRequest,
    background_tasks: BackgroundTasks
):
    """
    Generate Autocertificazione PDF and AI guide
    """
    try:
        print(f"🚀 Inizio generazione Autocertificazione per: {request.nome} {request.cognome}")
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        pdf_filename = f"autocertificazione_{request.cognome}_{request.nome}_{file_id}.pdf"
        pdf_path = os.path.join("data", "output", pdf_filename)
        
        print(f"📁 File ID: {file_id}")
        print(f"📄 PDF path: {pdf_path}")
        
        # Ensure output directory exists
        output_dir = os.path.dirname(pdf_path)
        os.makedirs(output_dir, exist_ok=True)
        print(f"✅ Directory creata: {output_dir}")
        
        # Generate PDF
        print("🔧 Generazione PDF Autocertificazione...")
        pdf_success = generate_autocertificazione_pdf(request.dict(), pdf_path)
        
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
        ai_guide = generate_autocertificazione_guide(request.dict())
        if not ai_guide:
            ai_guide = "Guida AI non disponibile. L'autocertificazione è stata generata correttamente."
        
        # Schedule file cleanup after 1 hour (commented for now)
        # background_tasks.add_task(cleanup_file, file_id)
        
        print("✅ Generazione Autocertificazione completata con successo!")
        
        return {
            "success": True,
            "guida": ai_guide,
            "pdfUrl": f"/api/download/{file_id}",
            "message": "Autocertificazione generata con successo"
        }
        
    except Exception as e:
        print(f"❌ Errore completo: {e}")
        raise HTTPException(status_code=500, detail=f"Errore interno: {str(e)}")

@router.get("/download/{file_id}")
async def download_autocertificazione_pdf(file_id: str):
    """
    Download generated Autocertificazione PDF file
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