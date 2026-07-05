# Arquitectura

OfficeMaster AI se organiza por modulos para que el proyecto pueda crecer sin volverse desordenado.

## Flujo general

```txt
Usuario -> Interfaz web -> API FastAPI -> Router -> Agentes -> Generadores -> Archivo descargable
```

## Modulos

### Router

Detecta si el usuario quiere Word, PowerPoint, Excel o modo automatico.

### Agente Word

Se encarga de documentos, informes, ensayos, cartas, redaccion y correccion.

### Agente PowerPoint

Se encarga de presentaciones, diapositivas, guiones, exposiciones y redisenos.

### Agente Excel

Se encarga de tablas, formulas, graficos, inventarios, ventas, gastos y dashboards.

### Generadores

Crean archivos reales en formatos `.docx`, `.pptx` y `.xlsx`.

## Tecnologias

- FastAPI
- python-docx
- python-pptx
- openpyxl
