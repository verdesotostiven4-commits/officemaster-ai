def detect_target(prompt: str, selected_type: str) -> str:
    if selected_type != 'auto':
        return selected_type

    text = prompt.lower()

    powerpoint_words = ['diapositiva', 'presentacion', 'powerpoint', 'ppt', 'exposicion']
    excel_words = ['excel', 'tabla', 'ventas', 'inventario', 'presupuesto', 'gastos', 'grafico', 'dashboard']
    word_words = ['word', 'informe', 'ensayo', 'documento', 'carta', 'apa', 'redaccion']

    if any(word in text for word in powerpoint_words):
        return 'powerpoint'
    if any(word in text for word in excel_words):
        return 'excel'
    if any(word in text for word in word_words):
        return 'word'

    return 'word'
