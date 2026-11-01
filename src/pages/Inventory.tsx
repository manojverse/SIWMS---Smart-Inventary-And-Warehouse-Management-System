import React, { useState } from 'react'
import { Search, Download, RefreshCw, ChevronUp, ChevronDown, Plus, Minus, Barcode, Scan, Upload } from 'lucide-react'
import { useData } from '../context/DataContext'
import type { StockStatus } from '../types'

const fmt = (n: number) => n >= 1000000 ? `₹${(n / 1000000).toFixed(2)}M` : `₹${n.toLocaleString('en-IN')}`

export default function Inventory() {
  const {
    inventory, warehouses, openBarcodeModal, openScannerModal,
    openExportModal, openImportModal, adjustStockQuantity, triggerManualSync, isSyncing
  } = useData()

  const [search, setSearch] = useState('')
  const [filterWarehouse, setFilterWarehouse] = useState('All')
  const [filterStatus, setFilterStatus] = useState<StockStatus | 'All'>('All')
  const [sortKey, setSortKey] = useState<string>('product')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = inventory.filter(item => {
    const q = search.toLowerCase()
    return (
      (filterWarehouse === 'All' || item.warehouse.includes(filterWarehouse)) &&
      (filterStatus === 'All' || item.status === filterStatus) &&
      (item.product.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.warehouse.toLowerCase().includes(q))
    )
  }).sort((a, b) => {
    const aVal = (a as any)[sortKey]
    const bVal = (b as any)[sortKey]
    if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal
  })

  const sort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ col }: { col: string }) => sortKey === col
    ? (sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />)
    : null

  const statuses: (StockStatus | 'All')[] = ['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Overstock']

  const totalValue = filtered.reduce((s, i) => s + i.value, 0)
  const outCount = filtered.filter(i => i.status === 'Out of Stock').length
  const lowCount = filtered.filter(i => i.status === 'Low Stock').length

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Inventory Ledger</div>
          <div className="page-subtitle">Real-time stock tracking · {inventory.length} active entries · Total value: {fmt(inventory.reduce((s, i) => s + i.value, 0))}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={openScannerModal}>
            <Scan size={13} /> Optical Scanner
          </button>
          <button className="btn-ghost" onClick={openImportModal}>
            <Upload size={13} /> Import Data
          </button>
          <button className="btn-ghost" onClick={() => triggerManualSync()} disabled={isSyncing}>
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} /> Sync
          </button>
          <button className="btn-primary" onClick={() => openExportModal()}>
            <Download size={13} /> Export Ledger
          </button>
        </div>
      </div>

      {/* Summary Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total Stock Entries', value: inventory.length, color: 'var(--color-primary)' },
          { label: 'Total Valuation', value: fmt(totalValue), color: 'var(--color-success)' },
          { label: 'Low Stock Warnings', value: lowCount, color: 'var(--color-warning)' },
          { label: 'Out of Stock SKUs', value: outCount, color: 'var(--color-danger)' },
        ].map(t => (
          <div key={t.label} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.label}</span>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: t.color }}>{t.value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="input-dark" style={{ paddingLeft: 32, width: 260 }} placeholder="Search product, SKU, warehouse…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-dark" value={filterWarehouse} onChange={e => setFilterWarehouse(e.target.value)}>
          <option value="All">All Warehouses</option>
          {warehouses.map(w => <option key={w.id} value={w.name.split(' ')[0]}>{w.name}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 4 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: '5px 10px', borderRadius: 5, border: '1px solid', fontSize: 11, cursor: 'pointer', fontWeight: 500,
              borderColor: filterStatus === s ? 'var(--color-primary)' : 'var(--color-border)',
              background: filterStatus === s ? 'var(--color-primary-muted)' : 'transparent',
              color: filterStatus === s ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}>{s}</button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} items · {fmt(filtered.reduce((s, i) => s + i.value, 0))}
        </span>
      </div>

      {/* Table */}
      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => sort('sku')} style={{ cursor: 'pointer' }}>SKU / Barcode <SortIcon col="sku" /></th>
              <th onClick={() => sort('product')} style={{ cursor: 'pointer' }}>Product <SortIcon col="product" /></th>
              <th onClick={() => sort('warehouse')} style={{ cursor: 'pointer' }}>Warehouse <SortIcon col="warehouse" /></th>
              <th onClick={() => sort('quantity')} style={{ cursor: 'pointer' }}>On Hand <SortIcon col="quantity" /></th>
              <th>Quick Adjust</th>
              <th>Reserved</th>
              <th onClick={() => sort('available')} style={{ cursor: 'pointer' }}>Available <SortIcon col="available" /></th>
              <th onClick={() => sort('value')} style={{ cursor: 'pointer' }}>Value <SortIcon col="value" /></th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const pct = item.quantity / item.maxStock
              return (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>{item.sku}</div>
                    <button
                      onClick={() => openBarcodeModal({ name: item.product, sku: item.sku, barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}` })}
                      className="flex items-center gap-1 font-mono text-[10px] text-slate-400 hover:text-indigo-500 hover:underline mt-0.5"
                    >
                      <Barcode className="w-3 h-3" />
                      <span>Tag</span>
                    </button>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 13 }}>{item.product}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Updated {item.lastUpdated}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{item.warehouse}</td>
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: item.quantity === 0 ? 'var(--color-danger)' : 'var(--color-text)', fontWeight: 700 }}>
                      {item.quantity.toLocaleString()}
                    </div>
                    <div style={{ width: 64, height: 3, background: 'var(--color-border)', borderRadius: 2, marginTop: 4 }}>
                      <div style={{ width: `${Math.min(pct * 100, 100)}%`, height: '100%', borderRadius: 2, background: pct > 0.9 ? 'var(--color-danger)' : pct > 0.5 ? 'var(--color-warning)' : 'var(--color-success)' }} />
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => adjustStockQuantity(item.id, -1, 'Quick Table Adjust')}
                        className="w-6 h-6 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center border border-rose-200"
                        title="Stock Out (-1)"
                      >
                        -
                      </button>
                      <button
                        onClick={() => adjustStockQuantity(item.id, 1, 'Quick Table Adjust')}
                        className="w-6 h-6 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold text-xs flex items-center justify-center border border-emerald-200"
                        title="Stock In (+1)"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>{item.reserved.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: item.available === 0 ? 'var(--color-danger)' : item.available < item.reorderLevel ? 'var(--color-warning)' : 'var(--color-text)' }}>
                    {item.available.toLocaleString()}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text)' }}>{fmt(item.value)}</td>
                  <td>
                    <span className={`badge badge-${item.status === 'In Stock' ? 'success' : item.status === 'Out of Stock' ? 'danger' : item.status === 'Low Stock' ? 'warning' : 'purple'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
