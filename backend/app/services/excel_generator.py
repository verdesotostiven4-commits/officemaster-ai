from pathlib import Path
from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.styles import Font, Alignment


def create_excel(prompt: str, title: str, style: str, output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    file_path = output_dir / 'officemaster_excel.xlsx'

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = 'OfficeMaster AI'

    sheet['A1'] = title or 'Archivo Excel generado por OfficeMaster AI'
    sheet['A1'].font = Font(size=14, bold=True)
    sheet['A3'] = 'Solicitud del usuario'
    sheet['B3'] = prompt

    headers = ['Producto', 'Cantidad', 'Costo', 'Precio venta', 'Ganancia']
    sheet.append([])
    sheet.append(headers)

    rows = [
        ['Producto A', 10, 2.50, 4.00, '=D6-C6'],
        ['Producto B', 8, 1.75, 3.00, '=D7-C7'],
        ['Producto C', 12, 3.00, 5.50, '=D8-C8']
    ]

    for row in rows:
        sheet.append(row)

    for cell in sheet[5]:
        cell.font = Font(bold=True)
        cell.alignment = Alignment(horizontal='center')

    chart = BarChart()
    chart.title = 'Ganancia por producto'
    chart.y_axis.title = 'Ganancia'
    chart.x_axis.title = 'Producto'

    data_ref = Reference(sheet, min_col=5, min_row=5, max_row=8)
    cats_ref = Reference(sheet, min_col=1, min_row=6, max_row=8)
    chart.add_data(data_ref, titles_from_data=True)
    chart.set_categories(cats_ref)
    sheet.add_chart(chart, 'G5')

    for column in ['A', 'B', 'C', 'D', 'E']:
        sheet.column_dimensions[column].width = 18

    workbook.save(file_path)
    return file_path
