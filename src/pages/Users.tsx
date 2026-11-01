import { useState } from 'react'
import { Search, Plus, Edit2, Lock, X } from 'lucide-react'
import { users } from '../data/mockData'
import type { UserRole } from '../types'

const roleColors: Record<UserRole, string> = {
  ADMIN: '#f43f5e',
  WAREHOUSE_MANAGER: '#38bdf8',
  INVENTORY_STAFF: '#10b981',
  PROCUREMENT_OFFICER: '#f59e0b',
  SALES_EXECUTIVE: '#a78bfa',
  FINANCE_MANAGER: '#22d3ee',
}
const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  WAREHOUSE_MANAGER: 'Warehouse Manager',
  INVENTORY_STAFF: 'Inventory Staff',
  PROCUREMENT_OFFICER: 'Procurement Officer',
  SALES_EXECUTIVE: 'Sales Executive',
  FINANCE_MANAGER: 'Finance Manager',
}

export default function Users() {
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<UserRole | 'All'>('All')
  const [showModal, setShowModal] = useState(false)

  const roles: (UserRole | 'All')[] = ['All', 'ADMIN', 'WAREHOUSE_MANAGER', 'INVENTORY_STAFF', 'PROCUREMENT_OFFICER', 'SALES_EXECUTIVE', 'FINANCE_MANAGER']

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (
      (filterRole === 'All' || u.role === filterRole) &&
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    )
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">User Management</div>
          <div className="page-subtitle">{users.length} users · {users.filter(u => u.status === 'Active').length} active · Role-based access control</div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Plus size={13} /> Invite User</button>
      </div>

      {/* Role distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 16 }}>
        {Object.entries(roleLabels).map(([role, label]) => {
          const count = users.filter(u => u.role === role).length
          const color = roleColors[role as UserRole]
          return (
            <button key={role} onClick={() => setFilterRole(filterRole === role ? 'All' : role as UserRole)} style={{
              background: filterRole === role ? color + '15' : 'var(--color-card)',
              border: `1px solid ${filterRole === role ? color + '40' : 'var(--color-border)'}`,
              borderRadius: 8, padding: '10px 12px', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color }}>{count}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2, lineHeight: 1.3 }}>{label}</div>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="input-dark" style={{ paddingLeft: 32, width: 280 }} placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead><tr>
            <th>User</th><th>Role</th><th>Warehouse</th><th>Last Login</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(user => {
              const color = roleColors[user.role]
              return (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: color + '20', color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, flexShrink: 0,
                      }}>{user.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 13 }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ padding: '3px 8px', borderRadius: 5, background: color + '15', color, fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{user.warehouse || '—'}</td>
                  <td style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{user.lastLogin}</td>
                  <td><span className={`badge badge-${user.status === 'Active' ? 'success' : 'muted'}`}>{user.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                        <Edit2 size={12} />
                      </button>
                      <button style={{ background: 'var(--color-warning-muted)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', color: 'var(--color-warning)' }}>
                        <Lock size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>Invite New User</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['Full Name', 'text'], ['Email Address', 'email']].map(([lbl, type]) => (
                <div key={lbl}>
                  <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{lbl}</label>
                  <input className="input-dark" type={type} style={{ width: '100%' }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Role</label>
                <select className="input-dark" style={{ width: '100%' }}>
                  {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>Department</label>
                <input className="input-dark" type="text" style={{ width: '100%' }} placeholder="e.g. Operations" />
              </div>
            </div>
            <div style={{ background: 'var(--color-surface)', borderRadius: 8, padding: '10px 14px', marginTop: 14, fontSize: 12, color: 'var(--color-text-muted)' }}>
              An invitation email will be sent with a temporary password. The user must change it on first login.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setShowModal(false)}>Send Invitation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
