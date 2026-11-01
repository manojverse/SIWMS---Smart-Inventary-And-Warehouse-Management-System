import { warehouses } from '../data/mockData'

const fmt = (n: number) => n.toLocaleString('en-IN')

export default function Warehouses() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Warehouse Network</div>
          <div className="page-subtitle">{warehouses.length} facilities · {warehouses.filter(w => w.status === 'Active').length} active</div>
        </div>
        <button className="btn-primary">+ Add Warehouse</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {warehouses.map(wh => {
          const util = Math.round((wh.used / wh.capacity) * 100)
          const barColor = util > 85 ? 'var(--color-danger)' : util > 70 ? 'var(--color-warning)' : 'var(--color-success)'
          return (
            <div key={wh.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', marginBottom: 4 }}>{wh.code}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>{wh.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 3 }}>{wh.location}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-dim)', marginTop: 1 }}>{wh.city}</div>
                </div>
                <span className={`badge badge-${wh.status === 'Active' ? 'success' : 'muted'}`}>{wh.status}</span>
              </div>

              {/* Utilization bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Capacity Utilization</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: barColor }}>{util}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3 }}>
                  <div style={{ width: `${util}%`, height: '100%', borderRadius: 3, background: barColor, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                  <span>Used: {fmt(wh.used)} sqft</span>
                  <span>Total: {fmt(wh.capacity)} sqft</span>
                </div>
              </div>

              {/* Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
                {[['Manager', wh.manager], ['Temperature', wh.temperature || 'Ambient'], ['Free Space', `${fmt(wh.capacity - wh.used)} sqft`], ['Utilization', `${util}%`]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', fontFamily: k === 'Manager' ? undefined : 'var(--font-mono)' }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>View Inventory</button>
                <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}>Edit</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
