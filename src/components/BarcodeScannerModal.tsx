import React, { useState } from 'react'
import { X, Camera, Scan, Search, Plus, Minus, CheckCircle, Package, AlertCircle } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function BarcodeScannerModal() {
  const { isScannerOpen, closeScannerModal, products, inventory, adjustStockQuantity, addSyncLog } = useData()
  const [query, setQuery] = useState('')
  const [scannedResult, setScannedResult] = useState<any>(null)
  const [successMsg, setSuccessMsg] = useState('')

  if (!isScannerOpen) return null

  const handleScanSearch = (searchVal: string) => {
    setQuery(searchVal)
    const q = searchVal.trim().toUpperCase()
    if (!q) {
      setScannedResult(null)
      return
    }

    // Lookup in products
    const matchedProd = products.find(p => p.sku.toUpperCase() === q || p.barcode === q)
    const matchedInv = inventory.filter(i => i.sku.toUpperCase() === q || (matchedProd && i.product.toLowerCase().includes(matchedProd.name.toLowerCase())))

    if (matchedProd || matchedInv.length > 0) {
      setScannedResult({
        product: matchedProd || { name: matchedInv[0].product, sku: matchedInv[0].sku, barcode: '8901234567890', category: 'General' },
        inventoryList: matchedInv
      })
      addSyncLog('barcode', `Barcode Scanned: ${q}`, `Matched item: ${matchedProd?.name || matchedInv[0]?.product}`, 'success')
    } else {
      setScannedResult('NOT_FOUND')
    }
  }

  const handleStockAdjust = (invId: number, amount: number) => {
    adjustStockQuantity(invId, amount, 'Barcode Scanner Rapid Adjust')
    setSuccessMsg(`Stock updated (${amount > 0 ? '+' : ''}${amount} units)`)
    setTimeout(() => setSuccessMsg(''), 2500)
    
    // Refresh local scanned view
    if (scannedResult && typeof scannedResult === 'object') {
      const updatedInv = inventory.map(item => item.id === invId ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item)
      setScannedResult({
        ...scannedResult,
        inventoryList: updatedInv.filter(i => i.sku.toUpperCase() === query.trim().toUpperCase())
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                Live Optical Barcode Scanner
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">CAMERA READY</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Scan barcode labels for instant lookup & stock adjustment</p>
            </div>
          </div>
          <button 
            onClick={closeScannerModal}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Simulated Camera Viewfinder */}
          <div className="relative bg-slate-950 rounded-xl overflow-hidden h-44 flex flex-col items-center justify-center border-2 border-indigo-500/40 shadow-inner group">
            {/* Animated Laser Scanning Line */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ef4444] animate-bounce my-auto top-0 bottom-0 pointer-events-none" />
            
            {/* Viewfinder Corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-indigo-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-indigo-400" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-indigo-400" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-indigo-400" />

            <Scan className="w-10 h-10 text-indigo-400/80 mb-2 animate-pulse" />
            <p className="text-xs text-slate-400 font-mono">Align Barcode / QR Code inside reticle</p>

            {/* Quick Demo Scan Pills */}
            <div className="absolute bottom-3 flex items-center gap-1.5 z-10 px-2 flex-wrap justify-center">
              <span className="text-[10px] text-slate-400 mr-1 font-semibold">Demo Scans:</span>
              {['ELEC-001', '8901234567891', 'PHARMA-001', 'FMCG-001'].map(demo => (
                <button
                  key={demo}
                  onClick={() => handleScanSearch(demo)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-[10px] font-mono rounded border border-slate-700 transition-colors"
                >
                  {demo}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleScanSearch(e.target.value)}
              placeholder="Or manually enter SKU or Barcode digits..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Feedback Success banner */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {successMsg}
            </div>
          )}

          {/* Search Results Display */}
          {scannedResult === 'NOT_FOUND' && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-center">
              <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-1" />
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">No matching item found for "{query}"</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Verify barcode number or register new SKU in Products section.</p>
            </div>
          )}

          {scannedResult && typeof scannedResult === 'object' && scannedResult.product && (
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {scannedResult.product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>SKU: {scannedResult.product.sku}</span>
                    <span>•</span>
                    <span>BARCODE: {scannedResult.product.barcode}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-lg border border-indigo-200 dark:border-indigo-800">
                  {scannedResult.product.category}
                </span>
              </div>

              {/* Warehouse Inventory Stock Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Warehouse Stock & Instant Scan Adjustments:
                </span>
                {scannedResult.inventoryList && scannedResult.inventoryList.length > 0 ? (
                  scannedResult.inventoryList.map((invItem: any) => (
                    <div 
                      key={invItem.id}
                      className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">{invItem.warehouse}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Available: <strong>{invItem.available}</strong> {invItem.unit}s</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStockAdjust(invItem.id, -1)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 rounded-lg border border-rose-200 dark:border-rose-800 font-bold text-xs flex items-center gap-1 transition-colors"
                          title="Instant Out-Stock (-1)"
                        >
                          <Minus className="w-3.5 h-3.5" />
                          Out (-1)
                        </button>
                        <button
                          onClick={() => handleStockAdjust(invItem.id, 1)}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-lg border border-emerald-200 dark:border-emerald-800 font-bold text-xs flex items-center gap-1 transition-colors"
                          title="Instant In-Stock (+1)"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          In (+1)
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg text-xs text-slate-500">
                    No active warehouse inventory entries found for this product.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
