from pathlib import Path
from fastapi import FastAPI, Form
from fastapi.responses import FileResponse, HTMLResponse

from app.models import GenerateRequest
from app.services.router_agent import detect_target
from app.services.word_generator import create_word_document
from app.services.powerpoint_generator import create_powerpoint
from app.services.excel_generator import create_excel

BASE_DIR = Path(__file__).resolve().parent
EXPORTS_DIR = BASE_DIR.parent / 'exports'
EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title='OfficeMaster AI', version='0.1.0')

HTML = '''
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OfficeMaster AI</title>
<style>
body{font-family:Arial,sans-serif;margin:0;background:#0f172a;color:white}.page{max-width:900px;margin:auto;padding:40px}.panel{background:#1e293b;padding:24px;border-radius:20px}input,select,textarea,button{width:100%;padding:12px;margin:8px 0;border-radius:10px}button{background:#38bdf8;font-weight:bold;border:0}.cards{display:grid;gap:12px;margin-top:20px}.card{background:#1e293b;padding:18px;border-radius:16px}
</style>
</head>
<body>
<main class="page">
<h1>OfficeMaster AI</h1>
<p>Crea Word, PowerPoint y Excel de forma rapida y profesional.</p>
<section class="panel">
<form action="/generate-form" method="post">
<input name="title" value="OfficeMaster AI">
<select name="file_type"><option value="auto">Automatico</option><option value="word">Word</option><option value="powerpoint">PowerPoint</option><option value="excel">Excel</option></select>
<select name="style"><option value="professional">Profesional</option><option value="academic">Academico</option><option value="school">Escolar</option><option value="business">Negocio</option></select>
<textarea name="prompt" rows="7" placeholder="Escribe lo que quieres crear"></textarea>
<button type="submit">Generar archivo</button>
</form>
</section>
<section class="cards"><div class="card">Word: informes y documentos</div><div class="card">PowerPoint: presentaciones</div><div class="card">Excel: tablas y graficos</div></section>
</main>
</body>
</html>
'''

@app.get('/', response_class=HTMLResponse)
def home():
    return HTML

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
def generate_from_form(prompt: str = Form(...), file_type: str = Form('auto'), style: str = Form('professional'), title: str = Form('OfficeMaster AI')):
    request = GenerateRequest(prompt=prompt, file_type=file_type, style=style, title=title)
    return generate_file(request)
