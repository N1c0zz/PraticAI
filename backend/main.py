"""
FastAPI main application for PraticAI
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
from datetime import datetime
import uuid
from dotenv import load_dotenv
load_dotenv()

from routes.generate import router as generate_router
from routes.autocertificazione import router as autocertificazione_router
from routes.autocertificazione_nascita import router as autocertificazione_nascita_router

app = FastAPI(
    title="PraticAI API",
    description="API per la generazione automatica di documenti burocratici",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(generate_router, prefix="/api")
app.include_router(autocertificazione_router, prefix="/api")
app.include_router(autocertificazione_nascita_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "PraticAI API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}