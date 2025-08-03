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