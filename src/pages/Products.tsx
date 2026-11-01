import React, { useState } from 'react'
import { Search, Plus, Barcode, Edit2, Trash2, X, Package, Download, Upload, RefreshCw, QrCode, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import type { Product } from '../types'

const fmt = (n: number | undefined | null) => `₹${(Number(n) || 0).toLocaleString('en-IN')}`

export default function Products() {
  const {
    products, categories, suppliers, userRole, addProduct, updateProduct, deleteProduct,
    openBarcodeModal, openImportModal, openExportModal, resetToDemoData
  } = useData()

  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [formErr, setFormErr] = useState('')
  const [noticeMsg, setNoticeMsg] = useState('')
  const [form, setForm] = useState({
    name: '', sku: '', category: 'Electronics', supplier: 'TechSource Global Pvt Ltd',
    unit: 'Piece', costPrice: '', sellingPrice: '', reorderLevel: '', maxStock: '', expiryTracked: false
  })

  // Safe filtering without any possible null/undefined dereference crash
  const safeProducts = Array.isArray(products) ? products : []
  const filtered = safeProducts.filter(p => {
    if (!p) return false
    const q = (search || '').toLowerCase()
    const catMatch = filterCat === 'All' || p.category === filterCat
    const nameMatch = (p.name || '').toLowerCase().includes(q)
    const skuMatch = (p.sku || '').toLowerCase().includes(q)
    const barcodeMatch = (p.barcode || '').includes(q)
    return catMatch && (nameMatch || skuMatch || barcodeMatch)
  })

  const openAdd = () => {
    setEditing(null)
    setFormErr('')
    const defaultCat = categories && categories.length > 0 ? categories[0].name : 'Electronics'
    const defaultSup = suppliers && suppliers.length > 0 ? suppliers[0].name : 'TechSource Global Pvt Ltd'
    setForm({
      name: 'Wireless Bluetooth Headset',
      sku: `ELEC-${Math.floor(100 + Math.random() * 900)}`,
      category: defaultCat,
      supplier: defaultSup,
      unit: 'Piece',
      costPrice: '1400',
      sellingPrice: '2100',
      reorderLevel: '25',
      maxStock: '500',
      expiryTracked: false
    })
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setFormErr('')
    setForm({
      name: p.name || '',
      sku: p.sku || '',
      category: p.category || 'Electronics',
      supplier: p.supplier || 'TechSource Global Pvt Ltd',
      unit: p.unit || 'Piece',
      costPrice: String(p.costPrice ?? ''),
      sellingPrice: String(p.sellingPrice ?? ''),
      reorderLevel: String(p.reorderLevel ?? ''),
      maxStock: String(p.maxStock ?? ''),
      expiryTracked: !!p.expiryTracked
    })
    setShowModal(true)
  }

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!form.name.trim()) {
      setFormErr('Please enter a valid Product Name')
      return
    }
    if (!form.sku.trim()) {
      setFormErr('Please enter a valid SKU Code')
      return
    }

    if (editing) {
      updateProduct(editing.id, {
        name: form.name.trim(),
        sku: form.sku.trim(),
        category: form.category,
        supplier: form.supplier,
        unit: form.unit,
        costPrice: Number(form.costPrice) || 0,
        sellingPrice: Number(form.sellingPrice) || 0,
        reorderLevel: Number(form.reorderLevel) || 0,
        maxStock: Number(form.maxStock) || 0,
        expiryTracked: form.expiryTracked
      })
      setNoticeMsg(`Updated details for product ${form.name}`)
    } else {
      const res = addProduct({
        sku: form.sku.trim(),
        barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        name: form.name.trim(),
        category: form.category,
        supplier: form.supplier,
        unit: form.unit,
        costPrice: Number(form.costPrice) || 0,
        sellingPrice: Number(form.sellingPrice) || 0,
        reorderLevel: Number(form.reorderLevel) || 0,
        maxStock: Number(form.maxStock) || 0,
        status: 'Active',
        expiryTracked: form.expiryTracked
      })
      setNoticeMsg(res.message)
    }

    setShowModal(false)
    setTimeout(() => setNoticeMsg(''), 4500)
  }

  const handleDelete = (id: number) => {
    const res = deleteProduct(id)
    setNoticeMsg(res.message)
    setTimeout(() => setNoticeMsg(''), 4500)
  }

  const margin = (cost: number | undefined, sell: number | undefined) => {
    const c = Number(cost) || 0
    const s = Number(sell) || 1
    return (((s - c) / s) * 100).toFixed(1)
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title font-bold text-xl flex items-center gap-2">
            Product Catalog
            {userRole === 'EMPLOYEE' && (
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                EMPLOYEE MODE (CHANGES REQUIRE ADMIN APPROVAL)
              </span>
            )}
          </div>
          <div className="page-subtitle">{safeProducts.length} registered products · {(categories || []).length} categories</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={resetToDemoData} title="Restore initial seed catalog">
            <RefreshCw size={13} /> Reset Seed Data
          </button>
          <button className="btn-ghost" onClick={openImportModal}>
            <Upload size={13} /> Import CSV
          </button>
          <button className="btn-ghost" onClick={() => openExportModal()}>
            <Download size={13} /> Export Catalog
          </button>
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={13} /> Add Product
          </button>
        </div>
      </div>

      {/* Notice Notification Banner */}
      {noticeMsg && (
        <div className={`mb-4 p-3.5 rounded-xl border flex items-center justify-between animate-in fade-in duration-200 ${
          noticeMsg.includes('Submitted')
            ? 'bg-amber-950/60 border-amber-800 text-amber-300'
            : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold">
            {noticeMsg.includes('Submitted') ? <ShieldAlert className="w-4 h-4 text-amber-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{noticeMsg}</span>
          </div>
          <button onClick={() => setNoticeMsg('')} className="text-slate-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            className="input-dark"
            style={{ width: '100%', paddingLeft: 32 }}
            placeholder="Search by name, SKU, barcode…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {['All', ...(categories || []).map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              style={{
                padding: '6px 12px', borderRadius: 6, border: '1px solid', fontSize: 12, cursor: 'pointer', fontWeight: 500,
                borderColor: filterCat === cat ? 'var(--color-primary)' : 'var(--color-border)',
                background: filterCat === cat ? 'var(--color-primary-muted)' : 'transparent',
                color: filterCat === cat ? 'var(--color-primary)' : 'var(--color-text-muted)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} / {safeProducts.length} items
        </div>
      </div>

      {/* Data Table */}
      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU / Barcode</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Cost Price</th>
              <th>Sell Price</th>
              <th>Margin</th>
              <th>Reorder Lvl</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>{p.sku || 'N/A'}</div>
                  <button 
                    onClick={() => openBarcodeModal({ name: p.name || 'Product', sku: p.sku || '', barcode: p.barcode || '8901234567890', price: p.sellingPrice })}
                    className="flex items-center gap-1 font-mono text-[10px] text-slate-400 hover:text-indigo-500 hover:underline mt-0.5"
                    title="View Barcode & QR Smart Tag"
                  >
                    <QrCode className="w-3 h-3 text-indigo-400" />
                    <span>{p.barcode || 'Generate Tag'}</span>
                  </button>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 13 }}>{p.name || 'Untitled Product'}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {p.unit || 'Piece'} · {p.expiryTracked ? '📅 Expiry tracked' : 'No expiry'}
                  </div>
                </td>
                <td><span className="badge badge-primary">{p.category || 'General'}</span></td>
                <td style={{ fontSize: 12 }}>{p.supplier || 'Direct'}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{fmt(p.costPrice)}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text)' }}>{fmt(p.sellingPrice)}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-success)' }}>
                  {margin(p.costPrice, p.sellingPrice)}%
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{(p.reorderLevel ?? 0).toLocaleString()}</td>
                <td><span className={`badge badge-${p.status === 'Active' ? 'success' : 'muted'}`}>{p.status || 'Active'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => openBarcodeModal({ name: p.name || 'Product', sku: p.sku || '', barcode: p.barcode || '8901234567890', price: p.sellingPrice })}
                      style={{ background: 'var(--color-primary-muted)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: 'var(--color-primary)' }}
                      title="Print Barcode & QR Code Labels"
                    >
                      <Barcode size={12} />
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{ background: 'var(--color-danger-muted)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: 'var(--color-danger)' }}
                      title="Delete Product"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Package size={32} style={{ marginBottom: 10, opacity: 0.3, marginLeft: 'auto', marginRight: 'auto' }} />
            <div className="font-semibold text-sm">No products found in catalog</div>
            <button
              onClick={resetToDemoData}
              className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Restore Core Products Catalog
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>{editing ? 'Edit Product' : 'Add New Product'}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                    {editing ? `SKU: ${editing.sku}` : userRole === 'EMPLOYEE' ? 'Requires Admin Approval' : 'Direct Admin Registration'}
                  </div>
                </div>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
              </div>

              {formErr && (
                <div style={{ marginBottom: 12, padding: '8px 12px', background: 'var(--color-danger-muted)', border: '1px solid var(--color-danger)', borderRadius: 7, fontSize: 12, color: 'var(--color-danger)' }}>
                  {formErr}
                </div>
              )}

              {userRole === 'EMPLOYEE' && (
                <div className="mb-4 p-3 bg-amber-950/40 border border-amber-800 text-amber-300 text-xs rounded-xl flex items-center gap-2 font-mono">
                  <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Submitting this form will send a change request to the Admin Approval Queue.</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Product Name', key: 'name', type: 'text', span: 2 },
                  { label: 'SKU Code', key: 'sku', type: 'text' },
                  { label: 'Unit', key: 'unit', type: 'text' },
                  { label: 'Cost Price (₹)', key: 'costPrice', type: 'number' },
                  { label: 'Selling Price (₹)', key: 'sellingPrice', type: 'number' },
                  { label: 'Reorder Level', key: 'reorderLevel', type: 'number' },
                  { label: 'Max Stock', key: 'maxStock', type: 'number' },
                ].map(f => (
                  <div key={f.key} style={f.span === 2 ? { gridColumn: 'span 2' } : {}}>
                    <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{f.label}</label>
                    <input
                      className="input-dark"
                      type={f.type}
                      style={{ width: '100%' }}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      required={f.key === 'name' || f.key === 'sku'}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Category</label>
                  <select className="input-dark" style={{ width: '100%' }} value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}>
                    {(categories || []).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Supplier</label>
                  <select className="input-dark" style={{ width: '100%' }} value={form.supplier} onChange={e => setForm(prev => ({ ...prev, supplier: e.target.value }))}>
                    {(suppliers || []).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" id="expiryCheck" checked={form.expiryTracked} onChange={e => setForm(prev => ({ ...prev, expiryTracked: e.target.checked }))} />
                  <label htmlFor="expiryCheck" style={{ fontSize: 13, color: 'var(--color-text-dim)', cursor: 'pointer' }}>Track Expiry Date / Batch Number</label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editing ? 'Save Changes' : userRole === 'EMPLOYEE' ? 'Submit for Admin Approval' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
