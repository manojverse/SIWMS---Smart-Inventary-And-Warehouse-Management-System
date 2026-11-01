import React, { useState } from 'react'
import { X, Download, FileSpreadsheet, FileCode, Printer, CheckCircle2 } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function ExportModal() {
  const { isExportOpen, closeExportModal, exportData } = useData()
  const [selectedEntity, setSelectedEntity] = useState<'products' | 'inventory' | 'purchaseOrders' | 'salesOrders' | 'suppliers' | 'transfers'>('products')
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'pdf'>('csv')
  const [downloaded, setDownloaded] = useState(false)

  if (!isExportOpen) return null

  const handleRunExport = () => {
    exportData(selectedEntity, selectedFormat)
    setDownloaded(true)
    setTimeout(() => {
      setDownloaded(false)
      closeExportModal()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Download className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Universal Data Export Center</h3>
              <p className="text-xs text-blue-200 font-mono">Export SIWMS data to CSV, JSON or Printable PDF</p>
            </div>
          </div>
          <button 
            onClick={closeExportModal}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Entity Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              1. Select Data Module
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'products', label: 'Products Master' },
                { id: 'inventory', label: 'Warehouse Stock' },
                { id: 'purchaseOrders', label: 'Purchase Orders' },
                { id: 'salesOrders', label: 'Sales Orders' },
                { id: 'suppliers', label: 'Suppliers Directory' },
                { id: 'transfers', label: 'Stock Transfers' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedEntity(item.id as any)}
                  className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                    selectedEntity === item.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              2. Select Output Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedFormat('csv')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedFormat === 'csv'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                <span className="text-xs">CSV Excel</span>
              </button>

              <button
                onClick={() => setSelectedFormat('json')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedFormat === 'json'
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileCode className="w-6 h-6 text-purple-500" />
                <span className="text-xs">JSON Raw Data</span>
              </button>

              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedFormat === 'pdf'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Printer className="w-6 h-6 text-rose-500" />
                <span className="text-xs">Printable PDF</span>
              </button>
            </div>
          </div>

          {/* Export Action */}
          <button
            onClick={handleRunExport}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            {downloaded ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export {selectedEntity.toUpperCase()} ({selectedFormat.toUpperCase()})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
