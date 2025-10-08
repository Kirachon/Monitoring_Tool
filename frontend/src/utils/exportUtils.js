// Utilities for client-side export (Excel, PDF, Chart Image)
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportToExcel({ columns, rows, filename = 'report.xlsx' }) {
  // columns: [{ key, title }]
  const header = columns.map(c => c.title)
  const data = rows.map(r => columns.map(c => r[c.key]))
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...data])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')
  const wbout = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url)
}

export function exportToPDF({ columns, rows, filename = 'report.pdf', title = 'Report' }) {
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(14)
  doc.text(title, 14, 14)
  const head = [columns.map(c => c.title)]
  const body = rows.map(r => columns.map(c => r[c.key]))
  autoTable(doc, { head, body, startY: 20, styles: { fontSize: 8 } })
  doc.save(filename)
}

export function exportChartImage(echartsInstance, filename = 'chart.png') {
  if (!echartsInstance || typeof echartsInstance.getDataURL !== 'function') return
  const url = echartsInstance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#fff' })
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
}

