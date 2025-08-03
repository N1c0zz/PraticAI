import requests
import json

def test_generate_endpoint():
    url = "http://localhost:8000/api/generate"
    
    test_data = {
        "nome": "Mario",
        "cognome": "Rossi",
        "codiceFiscale": "RSSMRA80A01H501X",
        "indirizzo": "Via Roma",
        "civico": "123",
        "cap": "20100",
        "comune": "Milano",
        "provincia": "MI",
        "codiceAteco": "62.01.00",
        "descrizioneAttivita": "Sviluppo software e applicazioni web",
        "regimeFiscale": "forfettario",
        "dataInizio": "2024-01-15",
        "email": "mario.rossi@email.com",
        "telefono": "3331234567"
    }
    
    response = requests.post(url, json=test_data)
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Test superato!")
        print(f"Guida generata: {len(result.get('guida', ''))} caratteri")
        print(f"PDF URL: {result.get('pdfUrl')}")
    else:
        print(f"❌ Test fallito: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_generate_endpoint()