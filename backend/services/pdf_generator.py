import os
from jinja2 import Template
import pdfkit
from typing import Dict, Any
from datetime import datetime

def generate_aa912_pdf(data: Dict[str, Any], output_path: str) -> bool:
    """
    Generate AA9/12 PDF from HTML template with user data
    """
    try:
        print(f"🔧 Inizio generazione PDF: {output_path}")
        
        # Load HTML template
        template_path = os.path.join("data", "aa912_template.html")
        print(f"📄 Caricamento template: {template_path}")
        
        if not os.path.exists(template_path):
            print(f"❌ Template non trovato: {template_path}")
            return False
            
        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()
        
        print("✅ Template caricato")
        
        # Prepare template data
        template_data = {
            **data,
            'data_compilazione': datetime.now().strftime('%d/%m/%Y'),
            'regime_forfettario_checked': 'checked' if data.get('regimeFiscale') == 'forfettario' else '',
            'regime_ordinario_checked': 'checked' if data.get('regimeFiscale') == 'ordinario' else '',
            'data_inizio_formatted': format_date(data.get('dataInizio', '')),
        }
        
        # Render template
        template = Template(template_content)
        html_content = template.render(**template_data)
        
        print("✅ Template renderizzato")
        
        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        print(f"📁 Directory output: {output_dir}")
        
        # Configure PDF options
        options = {
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': "UTF-8",
            'no-outline': None,
            'enable-local-file-access': None
        }
        
        print("🔧 Generazione PDF in corso...")
        
        # Generate PDF
        pdfkit.from_string(html_content, output_path, options=options)
        
        # Verify file was created
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            print(f"✅ PDF generato: {output_path} ({file_size} bytes)")
            return True
        else:
            print(f"❌ PDF non creato: {output_path}")
            return False
        
    except Exception as e:
        print(f"❌ Errore nella generazione PDF: {e}")
        return False

def format_date(date_string: str) -> str:
    """
    Convert date from YYYY-MM-DD to DD/MM/YYYY format
    """
    try:
        if date_string:
            date_obj = datetime.strptime(date_string, '%Y-%m-%d')
            return date_obj.strftime('%d/%m/%Y')
    except ValueError:
        pass
    return ''

def generate_autocertificazione_pdf(data: Dict[str, Any], output_path: str) -> bool:
    """
    Generate Autocertificazione di Residenza PDF from HTML template with user data
    """
    try:
        print(f"🔧 Inizio generazione PDF Autocertificazione: {output_path}")
        
        # Load HTML template
        template_path = os.path.join("data", "autocertificazione_template.html")
        print(f"📄 Caricamento template: {template_path}")
        
        if not os.path.exists(template_path):
            print(f"❌ Template non trovato: {template_path}")
            return False
            
        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()
        
        print("✅ Template caricato")
        
        # Prepare template data
        template_data = {
            **data,
            'data_compilazione': datetime.now().strftime('%d/%m/%Y'),
            'data_nascita_formatted': format_date(data.get('dataNascita', '')),
            'motivo_richiesta': data.get('motivoRichiesta', 'Uso generico')
        }
        
        # Render template
        template = Template(template_content)
        html_content = template.render(**template_data)
        
        print("✅ Template renderizzato")
        
        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        print(f"📁 Directory output: {output_dir}")
        
        # Configure PDF options
        options = {
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': "UTF-8",
            'no-outline': None,
            'enable-local-file-access': None
        }
        
        print("🔧 Generazione PDF in corso...")
        
        # Generate PDF
        pdfkit.from_string(html_content, output_path, options=options)
        
        # Verify file was created
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            print(f"✅ PDF Autocertificazione generato: {output_path} ({file_size} bytes)")
            return True
        else:
            print(f"❌ PDF non creato: {output_path}")
            return False
        
    except Exception as e:
        print(f"❌ Errore nella generazione PDF Autocertificazione: {e}")
        return False

def generate_autocertificazione_nascita_pdf(data: Dict[str, Any], output_path: str) -> bool:
    """
    Generate Autocertificazione di Nascita PDF from HTML template with user data
    """
    try:
        print(f"🔧 Inizio generazione PDF Autocertificazione Nascita: {output_path}")
        
        # Load HTML template
        template_path = os.path.join("data", "autocertificazione_nascita_template.html")
        print(f"📄 Caricamento template: {template_path}")
        
        if not os.path.exists(template_path):
            print(f"❌ Template non trovato: {template_path}")
            return False
            
        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()
        
        print("✅ Template caricato")
        
        # Prepare template data
        template_data = {
            **data,
            'data_compilazione': datetime.now().strftime('%d/%m/%Y'),
            'data_nascita_formatted': format_date(data.get('dataNascita', '')),
            'motivo_richiesta': data.get('motivoRichiesta', 'Uso generico'),
            'ospedale': data.get('ospedale', 'Non specificato')
        }
        
        # Render template
        template = Template(template_content)
        html_content = template.render(**template_data)
        
        print("✅ Template renderizzato")
        
        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        print(f"📁 Directory output: {output_dir}")
        
        # Configure PDF options
        options = {
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': "UTF-8",
            'no-outline': None,
            'enable-local-file-access': None
        }
        
        print("🔧 Generazione PDF in corso...")
        
        # Generate PDF
        pdfkit.from_string(html_content, output_path, options=options)
        
        # Verify file was created
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            print(f"✅ PDF Autocertificazione Nascita generato: {output_path} ({file_size} bytes)")
            return True
        else:
            print(f"❌ PDF non creato: {output_path}")
            return False
        
    except Exception as e:
        print(f"❌ Errore nella generazione PDF Autocertificazione Nascita: {e}")
        return False

def generate_autocertificazione_stato_civile_pdf(data: Dict[str, Any], output_path: str) -> bool:
    """
    Generate Autocertificazione di Stato Civile PDF from HTML template with user data
    """
    try:
        print(f"🔧 Inizio generazione PDF Autocertificazione Stato Civile: {output_path}")
        
        # Load HTML template
        template_path = os.path.join("data", "autocertificazione_stato_civile_template.html")
        print(f"📄 Caricamento template: {template_path}")
        
        if not os.path.exists(template_path):
            print(f"❌ Template non trovato: {template_path}")
            return False
            
        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()
        
        print("✅ Template caricato")
        
        # Prepare template data with stato civile specific fields
        stato_civile = data.get('statoCivile', '')
        
        template_data = {
            **data,
            'data_compilazione': datetime.now().strftime('%d/%m/%Y'),
            'dataNascita_formatted': format_date(data.get('dataNascita', '')),
            'motivo_richiesta': data.get('motivoRichiesta', 'Uso generico'),
            
            # Checkbox flags for stato civile
            'celibe_nubile_checked': 'checked' if stato_civile == 'celibe_nubile' else '',
            'coniugato_checked': 'checked' if stato_civile == 'coniugato' else '',
            'separato_checked': 'checked' if stato_civile == 'separato' else '',
            'divorziato_checked': 'checked' if stato_civile == 'divorziato' else '',
            'vedovo_checked': 'checked' if stato_civile == 'vedovo' else '',
            
            # Formatted dates for conditional fields
            'dataMatrimonio_formatted': format_date(data.get('dataMatrimonio', '')) if data.get('dataMatrimonio') else '',
            'dataSeparazione_formatted': format_date(data.get('dataSeparazione', '')) if data.get('dataSeparazione') else '',
            'dataDivorzio_formatted': format_date(data.get('dataDivorzio', '')) if data.get('dataDivorzio') else '',
            'dataDecesso_formatted': format_date(data.get('dataDecesso', '')) if data.get('dataDecesso') else '',
            
            # Other conditional fields with defaults
            'nomeConiuge': data.get('nomeConiuge', ''),
            'cognomeConiuge': data.get('cognomeConiuge', ''),
            'comuneMatrimonio': data.get('comuneMatrimonio', ''),
            'tribunaleCompetente': data.get('tribunaleCompetente', '')
        }
        
        # Render template
        template = Template(template_content)
        html_content = template.render(**template_data)
        
        print("✅ Template renderizzato")
        
        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        os.makedirs(output_dir, exist_ok=True)
        print(f"📁 Directory output: {output_dir}")
        
        # Configure PDF options
        options = {
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': "UTF-8",
            'no-outline': None,
            'enable-local-file-access': None
        }
        
        print("🔧 Generazione PDF in corso...")
        
        # Generate PDF
        pdfkit.from_string(html_content, output_path, options=options)
        
        # Verify file was created
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            print(f"✅ PDF Autocertificazione Stato Civile generato: {output_path} ({file_size} bytes)")
            return True
        else:
            print(f"❌ PDF non creato: {output_path}")
            return False
        
    except Exception as e:
        print(f"❌ Errore nella generazione PDF Autocertificazione Stato Civile: {e}")
        return False