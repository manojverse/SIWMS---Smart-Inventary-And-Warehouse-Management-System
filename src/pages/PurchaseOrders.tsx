import React, { useState } from 'react'
import { Search, Plus, FileText, CheckCircle, X, Clock, Download } from 'lucide-react'
import { useData } from '../context/DataContext'
import type { POStatus } from '../types'

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

const statusConfig: Record<POStatus, { cls: string; icon: React.ElementType }> = {
  Draft: { cls: 'badge-muted', icon: FileText },
  Pending: { cls: 'badge-warning', icon: Clock },
  Approved: { cls: 'badge-primary', icon: CheckCircle },
  Ordered: { cls: 'badge-primary', icon: FileText },
  Received: { cls: 'badge-success', icon: CheckCircle },
  Cancelled: { cls: 'badge-danger', icon: X },
}

export default function PurchaseOrders() {
  const { purchaseOrders, suppliers, warehouses, createPurchaseOrder, openExportModal } = useData()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<POStatus | 'All'>('All')

  const [form, setForm] = useState({
    supplier: suppliers[0]?.name || 'Reliance Supply Chain Ltd',
    warehouse: warehouses[0]?.name || 'Delhi Central Hub',
    items: '5',
    totalAmount: '250000',
    expectedDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  })

  const statuses: (POStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Ordered', 'Received', 'Cancelled']

  const filtered = purchaseOrders.filter(po => {
    const q = search.toLowerCase()
    return (
      (activeTab === 'All' || po.status === activeTab) &&
      (po.poNumber.toLowerCase().includes(q) || po.supplier.toLowerCase().includes(q))
    )
  })

  const totalValue = filtered.reduce((s, p) => s + p.totalAmount, 0)
  const pendingPayment = filtered.reduce((s, p) => s + (p.totalAmount - p.paidAmount), 0)

  const handleCreatePO = (status: POStatus = 'Pending') => {
    createPurchaseOrder({
      supplier: form.supplier,
      warehouse: form.warehouse,
      status,
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDate: form.expectedDate,
      items: Number(form.items) || 1,
      totalAmount: Number(form.totalAmount) || 100000,
      paidAmount: status === 'Received' ? Number(form.totalAmount) : 0,
      createdBy: 'Arjun Mehta'
    })
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title font-bold text-xl">Purchase Orders</div>
          <div className="page-subtitle">{purchaseOrders.length} total orders · {purchaseOrders.filter(p => p.status === 'Pending').length} pending approval</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={() => openExportModal()}>
            <Download size={13} /> Export POs
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={13} /> Create PO
          </button>
        </div>
      </div>

      {/* Status Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
        {statuses.filter(s => s !== 'All').map(s => {
          const count = purchaseOrders.filter(p => p.status === s).length
          return (
            <button key={s} onClick={() => setActiveTab(s)} style={{
              background: activeTab === s ? 'var(--color-primary-muted)' : 'var(--color-card)',
              border: `1px solid ${activeTab === s ? 'rgba(56,189,248,0.3)' : 'var(--color-border)'}`,
              borderRadius: 8, padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: activeTab === s ? 'var(--color-primary)' : 'var(--color-text)' }}>{count}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{s}</div>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="input-dark" style={{ paddingLeft: 32, width: 280 }} placeholder="Search PO number, supplier…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
          Total: {fmt(totalValue)} · Pending balance: <span style={{ color: 'var(--color-warning)' }}>{fmt(pendingPayment)}</span>
        </span>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Supplier</th>
              <th>Warehouse</th>
              <th>Order Date</th>
              <th>Expected</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(po => {
              const cfg = statusConfig[po.status] || { cls: 'badge-muted' }
              const balance = po.totalAmount - po.paidAmount
              return (
                <tr key={po.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}>{po.poNumber}</td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{po.supplier}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>By {po.createdBy}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{po.warehouse}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{po.orderDate}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: po.status !== 'Received' && po.status !== 'Cancelled' && new Date(po.expectedDate) < new Date() ? 'var(--color-danger)' : 'var(--color-text-dim)' }}>
                    {po.expectedDate}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'center' }}>{po.items}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{fmt(po.totalAmount)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-success)' }}>{fmt(po.paidAmount)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: balance > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                    {fmt(balance)}
                  </td>
                  <td><span className={`badge ${cfg.cls}`}>{po.status}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Create PO Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>Create Purchase Order</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>PO Generation Wizard</div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Supplier</label>
                <select className="input-dark" style={{ width: '100%' }} value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))}>
                  {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Destination Warehouse</label>
                <select className="input-dark" style={{ width: '100%' }} value={form.warehouse} onChange={e => setForm(p => ({ ...p, warehouse: e.target.value }))}>
                  {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Expected Delivery Date</label>
                <input className="input-dark" type="date" style={{ width: '100%' }} value={form.expectedDate} onChange={e => setForm(p => ({ ...p, expectedDate: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Estimated Total Amount (₹)</label>
                <input className="input-dark" type="number" style={{ width: '100%' }} value={form.totalAmount} onChange={e => setForm(p => ({ ...p, totalAmount: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-ghost" onClick={() => handleCreatePO('Draft')}>Save as Draft</button>
              <button className="btn-primary" onClick={() => handleCreatePO('Pending')}>Create & Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
