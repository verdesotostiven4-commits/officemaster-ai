from pathlib import Path
from fastapi import FastAPI, Form
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.models import GenerateRequest
from app.services.router_agent import detect_target
from app.services.word_generator import create_word_document
from app.services.powerpoint_generator import create_powerpoint
from app.services.excel_generator import create_excel

BASE_DIR = Path(__file__).resolve().parent
EXPORTS_DIR = BASE_DIR.parent / 'exports'
TEMPLATE_DIR = BASE_DIR / 'templates'
STATIC_DIR = BASE_DIR / 'static'

EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title='OfficeMaster AI', version='0.1.0')
app.mount('/static', StaticFiles(directory=STATIC_DIR), name='static')

@app.get('/', response_class=HTMLResponse)
def home():
    index_path = TEMPLATE_DIR / 'index.html'
    return index_path.read_text(encoding='utf-8')

@app.post('/api/generate')
def generate_file(request: GenerateRequest):
    target = detect_target(request.prompt, request.file_type)

    if target == 'powerpoint':
        file_path = create_powerpoint(request.prompt, request.title, request.style, EXPORTS_DIR)
        return FileResponse(file_path, filename=file_path.name)

    if target == 'excel':
        file_path = create_excel(request.prompt, request.title, request.style, EXPORTS_DIR)
        return FileResponse(file_path, filename=file_path.name)

    file_path = create_word_document(request.prompt, request.title, request.style, EXPORTS_DIR)
    return FileResponse(file_path, filename=file_path.name)

@app.post('/generate-form')
def generate_from_form(
    prompt: str = Form(...),
    file_type: str = Form('auto'),
    style: str = Form('professional'),
    title: str = Form('OfficeMaster AI')
):
    request = GenerateRequest(prompt=prompt, file_type=file_type, style=style, title=title)
    return generate_file(request)

@app.get('/api/ideas')
def ideas():
    return {
        'word': ['Crear informe', 'Corregir redaccion', 'Crear ensayo', 'Crear carta formal'],
        'powerpoint': ['Crear presentacion', 'Crear exposicion', 'Crear guion', 'Crear pitch deck'],
        'excel': ['Control de ventas', 'Inventario', 'Presupuesto', 'Dashboard basico']
    }
