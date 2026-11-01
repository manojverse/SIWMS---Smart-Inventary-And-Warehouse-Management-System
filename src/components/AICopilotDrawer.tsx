import React, { useState } from 'react'
import { Bot, X, Send, Sparkles, Scan, FileSpreadsheet, Package, AlertTriangle, ArrowRight, CheckCircle2, Trash2, Plus, ArrowLeftRight } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function AICopilotDrawer() {
  const {
    products, inventory, alerts, purchaseOrders, salesOrders, warehouses, suppliers, transfers,
    openScannerModal, openImportModal, openExportModal, openBarcodeModal,
    addProduct, deleteProduct, adjustStockQuantity, createPurchaseOrder,
    createSalesOrder, createStockTransfer, acknowledgeAlert, resetToDemoData, exportData
  } = useData()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: "👋 Hi! I'm your SIWMS AI Autonomous Assistant.\n\nI can answer ANY question about the website, analytics, and tech stack, as well as AUTOMATICALLY perform actions like adding/deleting products, adjusting stock, creating POs/SOs, stock transfers, and generating QR tags!"
    }
  ])
  const [inputVal, setInputVal] = useState('')

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputVal).trim()
    if (!q) return

    setMessages(prev => [...prev, { sender: 'user', text: q }])
    if (!textToSend) setInputVal('')

    setTimeout(() => {
      let aiText = ''
      const lower = q.toLowerCase()

      // --- AUTOMATED ACTION COMMANDS ---

      // 1. ADD PRODUCT
      if (lower.startsWith('add product') || lower.startsWith('add item') || lower.startsWith('create product')) {
        const parts = q.replace(/add product|add item|create product/gi, '').trim().split(' ')
        const namePart = parts.length > 0 ? parts[0] : 'New AI Item'
        const pricePart = parts.length > 1 ? Number(parts[1]) || 499 : 499
        const catPart = parts.length > 2 ? parts[2] : 'Electronics'

        const newSku = `AI-${Math.floor(1000 + Math.random() * 9000)}`
        addProduct({
          sku: newSku,
          barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          name: namePart,
          category: catPart,
          supplier: suppliers[0]?.name || 'TechSource Global',
          unit: 'Piece',
          costPrice: Math.round(pricePart * 0.7),
          sellingPrice: pricePart,
          reorderLevel: 25,
          maxStock: 500,
          status: 'Active',
          expiryTracked: false
        })
        aiText = `✅ Automatically created and registered new Product:\n• Name: "${namePart}"\n• SKU: ${newSku}\n• Price: ₹${pricePart.toLocaleString()}\n• Category: ${catPart}`
      }

      // 2. DELETE PRODUCT
      else if (lower.startsWith('delete product') || lower.startsWith('remove product') || lower.startsWith('delete item')) {
        const targetQuery = q.replace(/delete product|remove product|delete item/gi, '').trim().toUpperCase()
        const targetProd = products.find(p => p.sku.toUpperCase() === targetQuery || p.name.toLowerCase().includes(targetQuery.toLowerCase()))

        if (targetProd) {
          deleteProduct(targetProd.id)
          aiText = `🗑️ Automatically deleted Product "${targetProd.name}" (SKU: ${targetProd.sku}) from catalog.`
        } else if (products.length > 0) {
          const firstProd = products[0]
          deleteProduct(firstProd.id)
          aiText = `🗑️ Automatically deleted Product "${firstProd.name}" (SKU: ${firstProd.sku}) from catalog.`
        } else {
          aiText = `⚠️ Catalog is currently empty. No product to delete.`
        }
      }

      // 3. ADJUST STOCK
      else if (lower.includes('adjust stock') || lower.includes('add stock') || lower.includes('reduce stock')) {
        const isReduce = lower.includes('reduce') || lower.includes('minus') || lower.includes('-')
        const amountMatch = q.match(/\d+/)
        const amount = amountMatch ? Number(amountMatch[0]) : 5
        const delta = isReduce ? -amount : amount

        const targetItem = inventory[0]
        if (targetItem) {
          adjustStockQuantity(targetItem.id, delta, 'AI Natural Language Command')
          aiText = `📦 Automatically adjusted stock for "${targetItem.product}" (${targetItem.warehouse}): ${delta >= 0 ? '+' : ''}${delta} units. New available quantity: ${Math.max(0, targetItem.available + delta)}.`
        } else {
          aiText = `⚠️ No active inventory entry found to adjust stock.`
        }
      }

      // 4. CREATE PO
      else if (lower.includes('create po') || lower.includes('draft po') || lower.includes('purchase order')) {
        const supplierName = suppliers[0]?.name || 'TechSource Global Pvt Ltd'
        const warehouseName = warehouses[0]?.name || 'Delhi Central Hub'
        createPurchaseOrder({
          supplier: supplierName,
          warehouse: warehouseName,
          status: 'Pending',
          orderDate: new Date().toISOString().slice(0, 10),
          expectedDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
          items: 4,
          totalAmount: 185000,
          paidAmount: 0,
          createdBy: 'AI Automated Copilot'
        })
        aiText = `🛒 Automatically generated Purchase Order:\n• Supplier: ${supplierName}\n• Destination: ${warehouseName}\n• Total Amount: ₹1,85,000\n• Added to Purchase Orders ledger!`
      }

      // 5. CREATE SO
      else if (lower.includes('create so') || lower.includes('sales order') || lower.includes('new order')) {
        const custName = 'Amazon India Services'
        createSalesOrder({
          customer: custName,
          warehouse: warehouses[0]?.name || 'Delhi Central Hub',
          status: 'Confirmed',
          orderDate: new Date().toISOString().slice(0, 10),
          items: 6,
          subtotal: 150000,
          tax: 27000,
          total: 177000,
          salesRep: 'Deepak Singh',
          paymentStatus: 'Unpaid'
        })
        aiText = `📈 Automatically created Sales Order:\n• Customer: ${custName}\n• Total Amount: ₹1,77,000 (inc. 18% GST)\n• Status: Confirmed in fulfillment queue!`
      }

      // 6. CREATE TRANSFER
      else if (lower.includes('transfer') || lower.includes('move stock')) {
        const prodName = products[0]?.name || 'Surf Excel Matic 3kg'
        createStockTransfer({
          fromWarehouse: warehouses[0]?.name || 'Delhi Central Hub',
          toWarehouse: warehouses[1]?.name || 'Hyderabad Distribution Center',
          product: prodName,
          quantity: 250,
          status: 'Pending',
          requestedBy: 'AI Automated Copilot',
          requestDate: new Date().toISOString().slice(0, 10)
        })
        aiText = `🔄 Automatically initiated Stock Transfer:\n• Product: ${prodName}\n• Quantity: 250 units\n• Route: Delhi Central Hub ➔ Hyderabad Distribution Center`
      }

      // 7. ACKNOWLEDGE ALERTS
      else if (lower.includes('clear alert') || lower.includes('ack alert') || lower.includes('resolve alert')) {
        alerts.forEach(a => acknowledgeAlert(a.id))
        aiText = `✅ Automatically acknowledged and marked all system warnings and critical alerts as resolved!`
      }

      // 8. EXPORT FILE
      else if (lower.includes('export') || lower.includes('download')) {
        const fmtType = lower.includes('pdf') ? 'pdf' : lower.includes('json') ? 'json' : 'csv'
        const entityType = lower.includes('inventory') ? 'inventory' : lower.includes('order') ? 'purchaseOrders' : 'products'
        exportData(entityType, fmtType)
        aiText = `📥 Automatically triggered export download for ${entityType.toUpperCase()} in ${fmtType.toUpperCase()} format!`
      }

      // 9. SHOW BARCODE / QR CODE
      else if (lower.includes('barcode') || lower.includes('qr code') || lower.includes('qr tag')) {
        const prod = products[0] || { name: 'Sample Item', sku: 'ELEC-001', barcode: '8901234567890', sellingPrice: 999 }
        openBarcodeModal({ name: prod.name, sku: prod.sku, barcode: prod.barcode, price: prod.sellingPrice })
        aiText = `🏷️ Automatically generated Code128 Barcode & 2D QR Pass tag for ${prod.name} (${prod.sku})!`
      }

      // 10. RESET DATA
      else if (lower.includes('reset') || lower.includes('restore seed')) {
        resetToDemoData()
        aiText = `🔄 Automatically restored core seed catalog (8 Products, Inventory Ledger, Orders, & Warehouses)!`
      }

      // --- INFORMATIONAL & WEBSITE Q&A INQUIRIES ---

      else if (lower.includes('low stock') || lower.includes('out of stock')) {
        const lowItems = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock')
        aiText = `Found ${lowItems.length} items requiring attention:\n` +
          lowItems.map(i => `• ${i.product} (${i.warehouse}): ${i.quantity} units (Status: ${i.status})`).join('\n')
      } else if (lower.includes('valuation') || lower.includes('total value') || lower.includes('worth')) {
        const totalVal = inventory.reduce((acc, item) => acc + item.value, 0)
        aiText = `The total warehouse inventory valuation across all ${warehouses.length} locations is ₹${totalVal.toLocaleString('en-IN')}.`
      } else if (lower.includes('tech stack') || lower.includes('technology') || lower.includes('architecture')) {
        aiText = `🌐 SIWMS Technology Architecture:\n• Frontend: React 19, Vite 8, Tailwind CSS v4, React Router v7, Recharts, Lucide React.\n• Backend: Java 17, Spring Boot 3.2, Spring Security + JWT, Spring Data JPA, MySQL 8.\n• Features: Barcode Vector Generator, Camera Reticle Optical Scanner, Live Sync Gateway, Universal Import/Export.`
      } else if (lower.includes('warehouse') || lower.includes('facility')) {
        aiText = `🏢 We operate ${warehouses.length} central warehouses across India:\n` +
          warehouses.map(w => `• ${w.name} (${w.city}): Capacity ${w.capacity.toLocaleString()} sqft (Used: ${Math.round((w.used/w.capacity)*100)}%)`).join('\n')
      } else if (lower.includes('supplier') || lower.includes('vendor')) {
        aiText = `🚚 Supplier Directory (${suppliers.length} active vendors):\n` +
          suppliers.map(s => `• ${s.name} (${s.country}): Rating ${s.rating}⭐ | On-Time: ${s.onTimeDelivery}%`).join('\n')
      } else {
        aiText = `I analyzed your project repository:\n• Catalog: ${products.length} Products\n• Inventory: ${inventory.length} Warehouse Ledger Entries\n• Active POs: ${purchaseOrders.length} Orders\n• Active SOs: ${salesOrders.length} Orders\n• Alerts: ${alerts.filter(a => !a.acknowledged).length} Active\n\nTry commands like "Add product Mechanical Keyboard 2999", "Delete product ELEC-001", "Create PO", "Adjust stock", or "Export CSV".`
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText }])
    }, 450)
  }

  return (
    <>
      {/* Floating Copilot Launcher Widget */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl shadow-indigo-600/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        title="SIWMS Autonomous AI Copilot"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-2">
          AI Copilot
        </span>
      </button>

      {/* Copilot Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[540px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl">
                <Bot className="w-5 h-5 text-indigo-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  SIWMS AI Autonomous Copilot
                  <span className="text-[9px] bg-emerald-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded font-mono">AUTONOMOUS</span>
                </h3>
                <p className="text-[10px] text-indigo-200">Q&A Engine & Real-time Action Automation</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick AI Action Pills */}
          <div className="p-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
            <button
              onClick={() => handleSend('Add product Wireless Earbuds 1999 Electronics')}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 font-semibold whitespace-nowrap flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-emerald-500" />
              + Add Product
            </button>
            <button
              onClick={() => handleSend('Delete product ELEC-001')}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 font-semibold whitespace-nowrap flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3 text-rose-500" />
              - Delete Product
            </button>
            <button
              onClick={() => handleSend('Adjust stock +10')}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 font-semibold whitespace-nowrap flex items-center gap-1"
            >
              <Package className="w-3 h-3 text-indigo-500" />
              Adjust Stock
            </button>
            <button
              onClick={() => handleSend('Create PO for TechSource')}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 font-semibold whitespace-nowrap flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-amber-500" />
              Create PO
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[84%] whitespace-pre-wrap leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Q&A or command AI (e.g. 'Add product Smart Watch 3999')..."
                className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
