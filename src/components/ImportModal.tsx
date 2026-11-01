import React, { useState } from 'react'
import { X, Upload, FileSpreadsheet, Download, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { useData } from '../context/DataContext'
import { parseCSVString, generateSampleCSV } from '../utils/exportImportUtils'

export default function ImportModal() {
  const { isImportOpen, closeImportModal, importItems } = useData()
  const [targetEntity, setTargetEntity] = useState<'products' | 'inventory' | 'suppliers' | 'orders'>('products')
  const [fileContent, setFileContent] = useState<string>('')
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [importResult, setImportResult] = useState<{ successCount: number; failCount: number } | null>(null)

  if (!isImportOpen) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setFileContent(text)
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(text)
          setParsedRows(Array.isArray(parsed) ? parsed : [parsed])
        } catch {
          setParsedRows([])
        }
      } else {
        const rows = parseCSVString(text)
        setParsedRows(rows)
      }
    }
    reader.readAsText(file)
  }

  const handleDownloadSample = () => {
    const csvStr = generateSampleCSV(targetEntity)
    const blob = new Blob([csvStr], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `siwms_${targetEntity}_template.csv`
    a.click()
  }

  const handleRunImport = () => {
    if (!parsedRows.length) return
    const res = importItems(targetEntity, parsedRows)
    setImportResult(res)
  }

  const handleReset = () => {
    setParsedRows([])
    setFileName('')
    setFileContent('')
    setImportResult(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Upload className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Data Import Wizard</h3>
              <p className="text-xs text-emerald-200 font-mono">Import Products, Stock, or Suppliers from CSV / JSON</p>
            </div>
          </div>
          <button 
            onClick={closeImportModal}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Target Selector */}
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Select Import Destination:
            </label>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {(['products', 'inventory', 'suppliers', 'orders'] as const).map(ent => (
                <button
                  key={ent}
                  onClick={() => { setTargetEntity(ent); handleReset() }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                    targetEntity === ent
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {ent}
                </button>
              ))}
            </div>
          </div>

          {/* Sample CSV Download Helper */}
          <div className="flex items-center justify-between bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Need a template file?</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Download formatted CSV template for {targetEntity}</div>
              </div>
            </div>
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template
            </button>
          </div>

          {/* File Upload Zone */}
          {!parsedRows.length && (
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/30 group">
              <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Click to browse or drop CSV/JSON file here</span>
              <span className="text-xs text-slate-400 mt-1">Supports UTF-8 encoded .csv and .json data feeds</span>
            </label>
          )}

          {/* Parsed Rows Preview */}
          {parsedRows.length > 0 && !importResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Loaded: <strong>{fileName}</strong> ({parsedRows.length} rows detected)
                </span>
                <button onClick={handleReset} className="text-rose-500 hover:underline">Change File</button>
              </div>

              {/* Data Preview Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto max-h-48">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 sticky top-0">
                    <tr>
                      {Object.keys(parsedRows[0]).map(h => (
                        <th key={h} className="p-2.5 font-bold border-b border-slate-200 dark:border-slate-800 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        {Object.keys(parsedRows[0]).map(h => (
                          <td key={h} className="p-2.5 font-mono text-slate-600 dark:text-slate-400">{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Result Banner */}
          {importResult && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Import Completed Successfully!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Added <strong>{importResult.successCount}</strong> items to {targetEntity}. (Failed/Skipped: {importResult.failCount})
              </p>
              <button
                onClick={() => { handleReset(); closeImportModal() }}
                className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {parsedRows.length > 0 && !importResult && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Ready to commit dataset to state</span>
            <div className="flex items-center gap-2">
              <button
                onClick={closeImportModal}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRunImport}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Import {parsedRows.length} Rows
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
