import React, { useState } from 'react'
import { X, Printer, Download, Copy, Check, QrCode, Barcode as BarcodeIcon } from 'lucide-react'
import { useData } from '../context/DataContext'
import { generateCode128SVG, generateQRCodeSVG, printBarcodeLabels } from '../utils/barcodeGenerator'

export default function BarcodeModal() {
  const { isBarcodeModalOpen, activeBarcodeItem, closeBarcodeModal, addSyncLog } = useData()
  const [copies, setCopies] = useState(6)
  const [copied, setCopied] = useState(false)

  if (!isBarcodeModalOpen || !activeBarcodeItem) return null

  const barcodeSvg = generateCode128SVG(activeBarcodeItem.barcode, 260, 80)
  const qrSvg = generateQRCodeSVG(activeBarcodeItem.sku, 110)

  const handlePrint = () => {
    printBarcodeLabels([activeBarcodeItem], copies)
    addSyncLog('barcode', 'Printed Barcode Label Tag', `${copies} copies for ${activeBarcodeItem.sku}`, 'info')
  }

  const handleCopyBarcode = () => {
    navigator.clipboard.writeText(activeBarcodeItem.barcode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <BarcodeIcon className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Barcode & Smart Tag Generator</h3>
              <p className="text-xs text-indigo-200 font-mono">SKU: {activeBarcodeItem.sku}</p>
            </div>
          </div>
          <button 
            onClick={closeBarcodeModal}
            className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Label Preview Card */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                SIWMS Smart Tag Standard
              </span>
              {activeBarcodeItem.price && (
                <span className="text-sm font-bold text-slate-700 dark:slate-300">
                  MSRP: ₹{activeBarcodeItem.price.toLocaleString()}
                </span>
              )}
            </div>

            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1 truncate">
              {activeBarcodeItem.name}
            </h4>

            <div className="flex items-center gap-2 mb-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>BARCODE: {activeBarcodeItem.barcode}</span>
              <button 
                onClick={handleCopyBarcode}
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Barcode & QR Code visuals */}
            <div className="grid grid-cols-3 gap-3 items-center bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="col-span-2 flex flex-col items-center justify-center">
                <div dangerouslySetInnerHTML={{ __html: barcodeSvg }} className="w-full" />
              </div>
              <div className="col-span-1 flex flex-col items-center justify-center pl-2 border-l border-slate-200 dark:border-slate-700">
                <div dangerouslySetInnerHTML={{ __html: qrSvg }} className="w-16 h-16" />
                <span className="text-[9px] font-mono text-slate-400 mt-1">QR PASS</span>
              </div>
            </div>
          </div>

          {/* Print Options */}
          <div className="flex items-center justify-between bg-indigo-50/60 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Print Quantity (Label Sheet)
              </label>
              <div className="flex items-center gap-2">
                {[1, 6, 12, 24].map(num => (
                  <button
                    key={num}
                    onClick={() => setCopies(num)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      copies === num
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {num} Tags
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              Print Labels
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
