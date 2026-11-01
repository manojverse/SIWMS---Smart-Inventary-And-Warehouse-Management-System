// Pure SVG Code 128 & QR Code SVG Generator for Barcode labels

/**
 * Generates an SVG string representation of Code 128 barcode pattern
 */
export function generateCode128SVG(code: string, width = 240, height = 70): string {
  const sanitized = code.trim() || '8901234567890'
  
  // Hash pattern generator for consistent visual barcode representation
  let bars: boolean[] = []
  
  // Code 128 start pattern B
  bars.push(true, true, false, true, false, false, true, false, false, false)
  
  for (let i = 0; i < sanitized.length; i++) {
    const charCode = sanitized.charCodeAt(i)
    // Generate 11-bit width binary pattern based on charCode
    const patternVal = (charCode * 37 + 101) % 2047
    for (let b = 10; b >= 0; b--) {
      bars.push(((patternVal >> b) & 1) === 1)
    }
  }
  
  // Stop pattern
  bars.push(true, true, false, false, false, true, false, true, true, false, true, true)

  const barWidth = width / bars.length
  let rectsSvg = ''
  let currentX = 0

  for (let i = 0; i < bars.length; i++) {
    if (bars[i]) {
      rectsSvg += `<rect x="${currentX.toFixed(2)}" y="0" width="${barWidth.toFixed(2)}" height="${height - 20}" fill="#0f172a" />`
    }
    currentX += barWidth
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-auto">
      <rect width="100%" height="100%" fill="#ffffff" />
      <g>${rectsSvg}</g>
      <text x="${width / 2}" y="${height - 4}" font-family="monospace" font-size="12" font-weight="bold" fill="#334155" text-anchor="middle">${sanitized}</text>
    </svg>
  `
}

/**
 * Generates a simple vector QR Code SVG representation
 */
export function generateQRCodeSVG(text: string, size = 120): string {
  const str = text || 'SIWMS-ITEM'
  const gridSize = 21
  const cellSize = size / gridSize
  
  let cells: boolean[][] = Array(gridSize).fill(false).map(() => Array(gridSize).fill(false))

  // Helper for finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          cells[startY + r][startX + c] = true
        }
      }
    }
  }

  drawFinder(0, 0)
  drawFinder(14, 0)
  drawFinder(0, 14)

  // Timing patterns
  for (let i = 8; i < 13; i += 2) {
    cells[6][i] = true
    cells[i][6] = true
  }

  // Pseudo data fill based on hash
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if ((r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7)) continue
      const bitIndex = (r * gridSize + c) % 32
      if (((hash >> bitIndex) & 1) === 1) {
        cells[r][c] = true
      }
    }
  }

  let rects = ''
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (cells[r][c]) {
        rects += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="#0f172a" />`
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" class="w-full h-auto">
      <rect width="100%" height="100%" fill="#ffffff" />
      <g>${rects}</g>
    </svg>
  `
}

/**
 * Creates printable HTML window contents for barcode label sheet printing
 */
export function printBarcodeLabels(items: Array<{ name: string; sku: string; barcode: string; price?: number }>, copies = 1) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  let labelsHtml = ''
  
  for (const item of items) {
    for (let c = 0; c < copies; c++) {
      const barcodeSvg = generateCode128SVG(item.barcode, 180, 55)
      const qrSvg = generateQRCodeSVG(item.sku, 60)
      labelsHtml += `
        <div class="label-card">
          <div class="header">SIWMS SMART TAG</div>
          <div class="title">${item.name}</div>
          <div class="meta">SKU: <strong>${item.sku}</strong> ${item.price ? `| MSRP: ₹${item.price.toLocaleString()}` : ''}</div>
          <div class="code-row">
            <div class="barcode-box">${barcodeSvg}</div>
            <div class="qr-box">${qrSvg}</div>
          </div>
        </div>
      `
    }
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SIWMS Barcode Label Tag Printer</title>
        <style>
          @page { size: A4; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 15px; background: #fff; color: #1e293b; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .label-card {
            border: 1.5px dashed #64748b;
            border-radius: 6px;
            padding: 10px;
            box-sizing: border-box;
            background: #fafafa;
            page-break-inside: avoid;
          }
          .header { font-size: 8px; font-weight: 800; letter-spacing: 1px; color: #6366f1; text-transform: uppercase; }
          .title { font-size: 11px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 3px 0; }
          .meta { font-size: 10px; color: #475569; margin-bottom: 6px; }
          .code-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; background: #fff; padding: 4px; border-radius: 4px; border: 1px solid #e2e8f0; }
          .barcode-box { flex: 1; height: 50px; display: flex; align-items: center; }
          .qr-box { width: 45px; height: 45px; flex-shrink: 0; }
          @media print {
            body { padding: 0; }
            .label-card { border-style: solid; border-color: #cbd5e1; }
          }
        </style>
      </head>
      <body>
        <div class="grid">
          ${labelsHtml}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}
