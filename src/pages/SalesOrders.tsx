import React, { useState } from 'react'
import { Search, Plus, X, Download } from 'lucide-react'
import { useData } from '../context/DataContext'
import type { SOStatus } from '../types'

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

const statusCls: Record<SOStatus, string> = {
  Draft: 'badge-muted',
  Confirmed: 'badge-primary',
  Picking: 'badge-warning',
  Shipped: 'badge-primary',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
  Returned: 'badge-danger',
}
const paymentCls = { Paid: 'badge-success', Partial: 'badge-warning', Unpaid: 'badge-danger' }

export default function SalesOrders() {
  const { salesOrders, warehouses, createSalesOrder, openExportModal } = useData()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<SOStatus | 'All'>('All')
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    customer: 'Flipkart India Pvt Ltd',
    warehouse: warehouses[0]?.name || 'Delhi Central Hub',
    items: '8',
    subtotal: '200000',
    salesRep: 'Deepak Singh'
  })

  const statuses: (SOStatus | 'All')[] = ['All', 'Confirmed', 'Picking', 'Shipped', 'Delivered', 'Returned', 'Cancelled']

  const filtered = salesOrders.filter(so => {
    const q = search.toLowerCase()
    return (
      (activeTab === 'All' || so.status === activeTab) &&
      (so.soNumber.toLowerCase().includes(q) || so.customer.toLowerCase().includes(q))
    )
  })

  const totalRevenue = filtered.reduce((s, o) => s + o.total, 0)

  const handleCreateSO = () => {
    const sub = Number(form.subtotal) || 100000
    const tax = Math.round(sub * 0.18)
    createSalesOrder({
      customer: form.customer,
      warehouse: form.warehouse,
      status: 'Confirmed',
      orderDate: new Date().toISOString().slice(0, 10),
      items: Number(form.items) || 1,
      subtotal: sub,
      tax,
      total: sub + tax,
      salesRep: form.salesRep,
      paymentStatus: 'Unpaid'
    })
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title font-bold text-xl">Sales Orders</div>
          <div className="page-subtitle">{salesOrders.length} total orders · {salesOrders.filter(o => ['Confirmed', 'Picking', 'Shipped'].includes(o.status)).length} active in fulfillment pipeline</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={() => openExportModal()}>
            <Download size={13} /> Export SOs
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={13} /> New Sales Order
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, borderBottom: '1px solid var(--color-border)', paddingBottom: 0 }}>
        {statuses.map(s => {
          const count = salesOrders.filter(o => s === 'All' || o.status === s).length
          return (
            <button key={s} onClick={() => setActiveTab(s)} style={{
              padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 500,
              color: activeTab === s ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: `2px solid ${activeTab === s ? 'var(--color-primary)' : 'transparent'}`,
              marginBottom: -1,
            }}>{s} <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', marginLeft: 4, opacity: 0.7 }}>({count})</span></button>
          )
        })}
        <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', paddingRight: 4 }}>
          {fmt(totalRevenue)} total
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="input-dark" style={{ paddingLeft: 32, width: 280 }} placeholder="Search order, customer…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>SO Number</th>
              <th>Customer</th>
              <th>Warehouse</th>
              <th>Order Date</th>
              <th>Ship Date</th>
              <th>Items</th>
              <th>Subtotal</th>
              <th>Tax (18%)</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(so => (
              <tr key={so.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}>{so.soNumber}</td>
                <td>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{so.customer}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{so.salesRep}</div>
                </td>
                <td style={{ fontSize: 12 }}>{so.warehouse}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{so.orderDate}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)' }}>{so.shipDate || '—'}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'center' }}>{so.items}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{fmt(so.subtotal)}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>{fmt(so.tax)}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{fmt(so.total)}</td>
                <td><span className={`badge ${paymentCls[so.paymentStatus]}`}>{so.paymentStatus}</span></td>
                <td><span className={`badge ${statusCls[so.status]}`}>{so.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>New Sales Order</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>SO Generation Wizard</div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Customer Name</label>
                <input className="input-dark" type="text" style={{ width: '100%' }} value={form.customer} onChange={e => setForm(p => ({ ...p, customer: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Fulfillment Warehouse</label>
                <select className="input-dark" style={{ width: '100%' }} value={form.warehouse} onChange={e => setForm(p => ({ ...p, warehouse: e.target.value }))}>
                  {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Subtotal (₹)</label>
                <input className="input-dark" type="number" style={{ width: '100%' }} value={form.subtotal} onChange={e => setForm(p => ({ ...p, subtotal: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Item Count</label>
                <input className="input-dark" type="number" style={{ width: '100%' }} value={form.items} onChange={e => setForm(p => ({ ...p, items: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateSO}>Create & Submit Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
