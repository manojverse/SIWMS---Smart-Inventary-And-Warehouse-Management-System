import React, { useState } from 'react'
import { ArrowLeftRight, Plus, X, Download } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function Transfers() {
  const { transfers, warehouses, products, createStockTransfer, openExportModal } = useData()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    fromWarehouse: warehouses[0]?.name || 'Delhi Central Hub',
    toWarehouse: warehouses[1]?.name || 'Hyderabad Distribution Center',
    product: products[0]?.name || 'Surf Excel Matic 3kg',
    quantity: '500'
  })

  const statusCls: Record<string, string> = {
    Pending: 'badge-warning',
    Approved: 'badge-primary',
    'In Transit': 'badge-primary',
    Received: 'badge-success',
    Cancelled: 'badge-danger',
  }

  const handleCreateTransfer = () => {
    createStockTransfer({
      fromWarehouse: form.fromWarehouse,
      toWarehouse: form.toWarehouse,
      product: form.product,
      quantity: Number(form.quantity) || 100,
      status: 'Pending',
      requestedBy: 'Priya Sharma',
      requestDate: new Date().toISOString().slice(0, 10)
    })
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title font-bold text-xl">Stock Transfers</div>
          <div className="page-subtitle">{transfers.length} transfers · {transfers.filter(t => t.status === 'In Transit').length} in transit between facilities</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={() => openExportModal()}>
            <Download size={13} /> Export Transfers
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={13} /> New Transfer
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {['Pending', 'Approved', 'In Transit', 'Received'].map(s => {
          const count = transfers.filter(t => t.status === s).length
          return (
            <div key={s} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s}</span>
              <span className={`badge ${statusCls[s]}`}>{count}</span>
            </div>
          )
        })}
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transfer No</th>
              <th>From</th>
              <th></th>
              <th>To</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Requested By</th>
              <th>Approved By</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map(t => (
              <tr key={t.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}>{t.transferNo}</td>
                <td style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text)' }}>{t.fromWarehouse}</td>
                <td><ArrowLeftRight size={12} color="var(--color-text-muted)" /></td>
                <td style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text)' }}>{t.toWarehouse}</td>
                <td style={{ fontSize: 13, color: 'var(--color-text)' }}>{t.product}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{t.quantity.toLocaleString()}</td>
                <td style={{ fontSize: 12 }}>{t.requestedBy}</td>
                <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.approvedBy || '—'}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{t.requestDate}</td>
                <td><span className={`badge ${statusCls[t.status]}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>New Stock Transfer</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>From Warehouse</label>
                <select className="input-dark" style={{ width: '100%' }} value={form.fromWarehouse} onChange={e => setForm(p => ({ ...p, fromWarehouse: e.target.value }))}>
                  {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>To Warehouse</label>
                <select className="input-dark" style={{ width: '100%' }} value={form.toWarehouse} onChange={e => setForm(p => ({ ...p, toWarehouse: e.target.value }))}>
                  {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Product</label>
                <select className="input-dark" style={{ width: '100%' }} value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))}>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Quantity</label>
                <input className="input-dark" type="number" style={{ width: '100%' }} value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateTransfer}>Submit Transfer Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
