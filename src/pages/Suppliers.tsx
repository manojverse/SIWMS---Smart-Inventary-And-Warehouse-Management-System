import React, { useState } from 'react'
import { Search, Plus, Star, X, Download, Upload } from 'lucide-react'
import { useData } from '../context/DataContext'

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

const StarRating = ({ rating }: { rating: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={11} fill={i <= Math.round(rating) ? 'var(--color-warning)' : 'transparent'} color={i <= Math.round(rating) ? 'var(--color-warning)' : 'var(--color-border-light)'} />
    ))}
    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)', marginLeft: 2 }}>{rating.toFixed(1)}</span>
  </div>
)

export default function Suppliers() {
  const { suppliers, openExportModal, openImportModal } = useData()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = suppliers.filter(s => {
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title font-bold text-xl">Supplier Directory</div>
          <div className="page-subtitle">{suppliers.filter(s => s.status === 'Active').length} active vendor partnerships</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={openImportModal}>
            <Upload size={13} /> Import CSV
          </button>
          <button className="btn-ghost" onClick={() => openExportModal()}>
            <Download size={13} /> Export Directory
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={13} /> Add Supplier
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total Suppliers', value: suppliers.length, color: 'var(--color-primary)' },
          { label: 'Total Orders', value: suppliers.reduce((s, x) => s + x.totalOrders, 0), color: 'var(--color-success)' },
          { label: 'Avg On-Time Delivery', value: `${Math.round(suppliers.reduce((s, x) => s + x.onTimeDelivery, 0) / (suppliers.length || 1))}%`, color: 'var(--color-warning)' },
          { label: 'Outstanding Balance', value: fmt(suppliers.reduce((s, x) => s + x.balance, 0)), color: 'var(--color-danger)' },
        ].map(t => (
          <div key={t.label} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.label}</span>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', color: t.color }}>{t.value}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="input-dark" style={{ paddingLeft: 32, width: 300 }} placeholder="Search supplier name, code, city…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Supplier</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Total Orders</th>
              <th>On-Time %</th>
              <th>Outstanding</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>{s.code}</td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s.country}</div>
                </td>
                <td>
                  <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>{s.contact}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{s.email}</div>
                </td>
                <td style={{ fontSize: 12 }}>{s.city}, {s.country}</td>
                <td><StarRating rating={s.rating} /></td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'center' }}>{s.totalOrders}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: 'var(--color-border)', borderRadius: 2, minWidth: 60 }}>
                      <div style={{ width: `${s.onTimeDelivery}%`, height: '100%', borderRadius: 2, background: s.onTimeDelivery >= 90 ? 'var(--color-success)' : s.onTimeDelivery >= 80 ? 'var(--color-warning)' : 'var(--color-danger)' }} />
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: s.onTimeDelivery >= 90 ? 'var(--color-success)' : s.onTimeDelivery >= 80 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                      {s.onTimeDelivery}%
                    </span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: s.balance > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>{fmt(s.balance)}</td>
                <td><span className={`badge badge-${s.status === 'Active' ? 'success' : 'muted'}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>Add New Supplier</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['Company Name', 'text', 2], ['Contact Person', 'text', 1], ['Phone', 'tel', 1], ['Email', 'email', 1], ['City', 'text', 1], ['Country', 'text', 1], ['Payment Terms (days)', 'number', 1]].map(([lbl, type, span]) => (
                <div key={lbl as string} style={span === 2 ? { gridColumn: 'span 2' } : {}}>
                  <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{lbl}</label>
                  <input className="input-dark" type={type as string} style={{ width: '100%' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowModal(false)}>Add Supplier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
