import React from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import {
  Package, Warehouse, TrendingUp, AlertTriangle,
  ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart,
  Activity, RefreshCw, Scan, Upload, Download
} from 'lucide-react'
import {
  stockMovementData, categoryValueData,
  revenueData, warehouseUtilizationData,
} from '../data/mockData'
import { useData } from '../context/DataContext'

const fmt = (n: number) => n >= 1000000 ? `₹${(n / 1000000).toFixed(2)}M` : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`

const KPICard = ({ icon: Icon, label, value, sub, color, delta, deltaUp }: {
  icon: React.ElementType; label: string; value: string; sub: string;
  color: string; delta?: string; deltaUp?: boolean;
}) => (
  <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={color} />
      </div>
      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontFamily: 'var(--font-mono)', color: deltaUp ? 'var(--color-success)' : 'var(--color-danger)' }}>
          {deltaUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {delta}
        </div>
      )}
    </div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color, fontFamily: 'var(--font-mono)', marginTop: 2 }}>{sub}</div>
    </div>
  </div>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null
  return (
    <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border-light)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, color: p.color }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--color-text-dim)' }}>{p.name}:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{typeof p.value === 'number' && p.value > 1000 ? fmt(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const {
    products, inventory, alerts, purchaseOrders, salesOrders, warehouses,
    isSyncing, triggerManualSync, openScannerModal, openExportModal
  } = useData()

  const unacknowledged = alerts.filter(a => !a.acknowledged)
  const criticalAlerts = unacknowledged.filter(a => a.severity === 'critical')
  const totalValuation = inventory.reduce((s, i) => s + i.value, 0)
  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length
  const pendingPOCount = purchaseOrders.filter(po => po.status === 'Pending' || po.status === 'Ordered').length

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title font-bold text-xl">Operations Dashboard</div>
          <div className="page-subtitle">Real-time Suite · Live System Diagnostics</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={openScannerModal}>
            <Scan size={13} /> Optical Scanner
          </button>
          <button className="btn-ghost" onClick={() => openExportModal()}>
            <Download size={13} /> Export Report
          </button>
          <button className="btn-primary" onClick={() => triggerManualSync()} disabled={isSyncing}>
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Gateway'}
          </button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div style={{
          background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.3)',
          borderRadius: 10, padding: '10px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <AlertTriangle size={16} color="var(--color-danger)" />
          <span style={{ fontSize: 13, color: 'var(--color-danger)', fontWeight: 600 }}>
            {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} require immediate attention
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flex: 1 }}>
            {criticalAlerts.map(a => a.product || a.message.substring(0, 40)).join(' · ')}
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <KPICard icon={Package} label="Total Products" value={products.length.toLocaleString()} sub="Catalog SKUs" color="#38bdf8" delta="+12 this month" deltaUp />
        <KPICard icon={DollarSign} label="Inventory Valuation" value={fmt(totalValuation)} sub="Book value at cost" color="#a78bfa" delta="+3.2% vs last month" deltaUp />
        <KPICard icon={TrendingUp} label="Monthly Revenue" value="₹1.67M" sub="July 2024 realized" color="#10b981" delta="+6.8% vs June" deltaUp />
        <KPICard icon={AlertTriangle} label="Active Alerts" value={unacknowledged.length.toString()} sub={`${criticalAlerts.length} critical · ${unacknowledged.length - criticalAlerts.length} warning`} color="#f43f5e" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <KPICard icon={Warehouse} label="Active Warehouses" value={warehouses.length.toString()} sub="Locations across India" color="#22d3ee" />
        <KPICard icon={ShoppingCart} label="Pending POs" value={pendingPOCount.toString()} sub="Awaiting receiving" color="#f59e0b" />
        <KPICard icon={AlertTriangle} label="Low Stock SKUs" value={lowStockCount.toString()} sub="Below reorder level" color="#f43f5e" delta="+3 since yesterday" deltaUp={false} />
        <KPICard icon={TrendingUp} label="Monthly Purchases" value="₹2.78M" sub="July 2024 committed" color="#10b981" />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Revenue vs Purchases */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Revenue vs Purchase Cost — 6 Months</div>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>Feb–Jul 2024</span>
          </div>
          <div style={{ padding: '20px 16px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="purGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="purchases" name="Purchases" stroke="#38bdf8" strokeWidth={2} fill="url(#purGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Inventory by Category</div>
          </div>
          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={categoryValueData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={2}>
                  {categoryValueData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v: any) => fmt(Number(v))} contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border-light)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', marginTop: 4 }}>
              {categoryValueData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: d.fill, display: 'inline-block' }} />
                    <span style={{ color: 'var(--color-text-dim)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontSize: 11 }}>{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Stock movement */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Stock Movement — Units</div>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>All warehouses</span>
          </div>
          <div style={{ padding: '16px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stockMovementData} barSize={8} barGap={3}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="received" name="Received" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="dispatched" name="Dispatched" fill="#38bdf8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="transferred" name="Transferred" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warehouse Utilization */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Warehouse Capacity</div>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {warehouseUtilizationData.map(w => (
              <div key={w.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>{w.name}</span>
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: w.used > 85 ? 'var(--color-danger)' : w.used > 70 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                    {w.used}%
                  </span>
                </div>
                <div style={{ height: 5, background: 'var(--color-border)', borderRadius: 3 }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${w.used}%`,
                    background: w.used > 85 ? 'var(--color-danger)' : w.used > 70 ? 'var(--color-warning)' : 'var(--color-success)',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent POs */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Recent Purchase Orders</div>
            <a href="/purchase-orders" style={{ fontSize: 11, color: 'var(--color-primary)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>View all →</a>
          </div>
          <table className="data-table">
            <thead><tr>
              <th>PO Number</th><th>Supplier</th><th>Amount</th><th>Status</th>
            </tr></thead>
            <tbody>
              {purchaseOrders.slice(0, 4).map(po => (
                <tr key={po.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-primary)' }}>{po.poNumber}</td>
                  <td style={{ maxWidth: 120 }}><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{po.supplier}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{fmt(po.totalAmount)}</td>
                  <td>
                    <span className={`badge badge-${po.status === 'Received' ? 'success' : po.status === 'Cancelled' ? 'danger' : po.status === 'Pending' ? 'warning' : 'primary'}`}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent SOs */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Recent Sales Orders</div>
            <a href="/sales-orders" style={{ fontSize: 11, color: 'var(--color-primary)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>View all →</a>
          </div>
          <table className="data-table">
            <thead><tr>
              <th>SO Number</th><th>Customer</th><th>Total</th><th>Status</th>
            </tr></thead>
            <tbody>
              {salesOrders.slice(0, 4).map(so => (
                <tr key={so.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-primary)' }}>{so.soNumber}</td>
                  <td style={{ maxWidth: 120 }}><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{so.customer}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{fmt(so.total)}</td>
                  <td>
                    <span className={`badge badge-${so.status === 'Delivered' ? 'success' : so.status === 'Returned' || so.status === 'Cancelled' ? 'danger' : so.status === 'Shipped' ? 'primary' : 'warning'}`}>
                      {so.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
