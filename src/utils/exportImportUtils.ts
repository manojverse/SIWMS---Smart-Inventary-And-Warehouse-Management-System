/**
 * Utility functions for Data Export (CSV, JSON, PDF Report) and Data Import (CSV, JSON)
 */

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return

  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(field => {
        const val = row[field] === undefined || row[field] === null ? '' : String(row[field])
        // Escape quotes
        return `"${val.replace(/"/g, '""')}"`
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(filename: string, data: any) {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToPrintablePDF(title: string, columns: { header: string; accessor: string }[], rows: Record<string, any>[]) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const tableHeaders = columns.map(c => `<th>${c.header}</th>`).join('')
  const tableRows = rows.map(r => `
    <tr>
      ${columns.map(c => `<td>${r[c.accessor] !== undefined && r[c.accessor] !== null ? r[c.accessor] : '-'}</td>`).join('')}
    </tr>
  `).join('')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Printable Report</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 25px; color: #1e293b; }
          .header-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px; }
          .brand { font-size: 20px; font-weight: 800; color: #4f46e5; }
          .meta { text-align: right; font-size: 12px; color: #64748b; }
          h1 { font-size: 18px; margin: 0 0 15px 0; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th { background: #f1f5f9; color: #334155; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; font-weight: 600; }
          td { padding: 9px 10px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background: #f8fafc; }
          .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header-bar">
          <div>
            <div class="brand">SIWMS ENTERPRISE</div>
            <div style="font-size:12px; color:#64748b;">Smart Inventory & Warehouse System</div>
          </div>
          <div class="meta">
            <div>Generated: ${new Date().toLocaleString()}</div>
            <div>Total Records: ${rows.length}</div>
          </div>
        </div>
        <h1>${title}</h1>
        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">
          Generated automatically by SIWMS Real-time Data Suite · Confidential Internal Report
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

export function parseCSVString(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim().length > 0)
  if (lines.length < 2) return []

  const parseLine = (text: string): string[] => {
    const result: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (char === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim())
        cur = ''
      } else {
        cur += char
      }
    }
    result.push(cur.trim())
    return result
  }

  const headers = parseLine(lines[0])
  const result: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i])
    if (values.length === headers.length) {
      const row: Record<string, string> = {}
      headers.forEach((h, idx) => {
        row[h] = values[idx]
      })
      result.push(row)
    }
  }

  return result
}

export function generateSampleCSV(type: 'products' | 'inventory' | 'suppliers' | 'orders'): string {
  if (type === 'products') {
    return `sku,barcode,name,category,supplier,unit,costPrice,sellingPrice,reorderLevel,maxStock,status\nELEC-999,8901234599999,Smart IoT Sensor V2,Electronics,TechSource Global,Piece,1200,1899,25,200,Active\nPHARMA-999,8901234588888,Amoxicillin 500mg,Pharmaceuticals,Pharma Distributors,Strip,45,75,100,5000,Active`
  } else if (type === 'inventory') {
    return `sku,product,warehouse,quantity,reserved,reorderLevel,maxStock,unit,status\nELEC-001,Samsung Galaxy Tab A9,Delhi Central Hub,250,40,50,500,Piece,In Stock\nFMCG-001,Surf Excel Matic 3kg,Mumbai Port Facility,1200,100,1000,20000,Pack,In Stock`
  } else if (type === 'suppliers') {
    return `code,name,contact,email,phone,city,country,rating,status\nSUP-999,Apex Logistics Ltd,Vikram Rao,vikram@apex.com,+91 99887 76655,Bengaluru,India,4.7,Active`
  } else {
    return `poNumber,supplier,warehouse,items,totalAmount,orderDate,expectedDate,status\nPO-2024-999,TechSource Global,Delhi Central Hub,10,450000,2024-07-31,2024-08-08,Pending`
  }
}
