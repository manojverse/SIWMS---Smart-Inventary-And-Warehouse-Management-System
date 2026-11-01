import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Download, FileText } from 'lucide-react'
import { revenueData, stockMovementData, categoryValueData, warehouseUtilizationData } from '../data/mockData'
import { useData } from '../context/DataContext'

const fmt = (n: number) => n >= 1000000 ? `₹${(n / 1000000).toFixed(2)}M` : `₹${(n / 1000).toFixed(0)}K`

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null
  return (
    <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border-light)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, color: p.color, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--color-text-dim)' }}>{p.name}:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {typeof p.value === 'number' && p.value > 1000 ? fmt(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

const supplierPerf = [
  { name: 'Reliance', orders: 342, onTime: 96, quality: 98 },
  { name: 'TechSource', orders: 218, onTime: 91, quality: 95 },
  { name: 'Pharma Dist', orders: 186, onTime: 98, quality: 99 },
  { name: 'AutoParts', orders: 97, onTime: 82, quality: 88 },
  { name: 'FastFast', orders: 428, onTime: 88, quality: 92 },
]

const profitData = [
  { month: 'Feb', revenue: 1240000, cost: 980000, profit: 260000 },
  { month: 'Mar', revenue: 1480000, cost: 1120000, profit: 360000 },
  { month: 'Apr', revenue: 1190000, cost: 890000, profit: 300000 },
  { month: 'May', revenue: 1720000, cost: 1340000, profit: 380000 },
  { month: 'Jun', revenue: 1560000, cost: 1180000, profit: 380000 },
  { month: 'Jul', revenue: 1667409, cost: 1240000, profit: 427409 },
]

const tabs = ['Revenue & P&L', 'Stock Movement', 'Supplier Performance', 'Warehouse Analytics', 'Inventory Valuation']

export default function Reports() {
  const { openExportModal } = useData()
  const [activeTab, setActiveTab] = useState(0)
  const [period, setPeriod] = useState('6M')

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title font-bold text-xl">Reports & Business Intelligence</div>
          <div className="page-subtitle">Interactive Analytics & Exportable Diagnostics</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['1M', '3M', '6M', 'YTD'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '5px 10px', borderRadius: 5, border: '1px solid', fontSize: 11, cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-mono)',
              borderColor: period === p ? 'var(--color-primary)' : 'var(--color-border)',
              background: period === p ? 'var(--color-primary-muted)' : 'transparent',
              color: period === p ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}>{p}</button>
          ))}
          <button className="btn-ghost" onClick={() => openExportModal()}>
            <Download size={13} /> Export PDF Report
          </button>
          <button className="btn-ghost" onClick={() => openExportModal()}>
            <FileText size={13} /> Export Excel Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border)', marginBottom: 20 }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} style={{
            padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 500,
            color: activeTab === i ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: `2px solid ${activeTab === i ? 'var(--color-primary)' : 'transparent'}`,
            marginBottom: -1, whiteSpace: 'nowrap',
          }}>{t}</button>
        ))}
      </div>

      {activeTab === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* KPI summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Total Revenue', value: '₹8.86M', delta: '+12.4%', color: 'var(--color-success)' },
              { label: 'Total Cost', value: '₹6.75M', delta: '+8.1%', color: 'var(--color-warning)' },
              { label: 'Gross Profit', value: '₹2.11M', delta: '+18.2%', color: 'var(--color-primary)' },
              { label: 'Profit Margin', value: '23.8%', delta: '+1.2pp', color: 'var(--color-purple)' },
            ].map(k => (
              <div key={k.label} className="stat-card">
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>{k.value}</div>
                <div style={{ fontSize: 11, color: k.color, fontFamily: 'var(--font-mono)', marginTop: 4 }}>↑ {k.delta} vs prev period</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
            <div className="panel">
              <div className="panel-header"><div className="panel-title">Revenue, Cost & Profit — Monthly</div></div>
              <div style={{ padding: 16 }}>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={profitData} barSize={12} barGap={4}>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000000).toFixed(1)}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="cost" name="Cost" fill="#38bdf8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#a78bfa" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><div className="panel-title">Profit Trend</div></div>
              <div style={{ padding: 16 }}>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={profitData}>
                    <defs>
                      <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="profit" name="Profit" stroke="#a78bfa" strokeWidth={2} fill="url(#profGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Stock In / Out / Transferred</div></div>
            <div style={{ padding: 16 }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stockMovementData} barSize={10} barGap={3}>
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
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Inventory Value by Category</div></div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryValueData} cx="50%" cy="50%" outerRadius={90} dataKey="value" paddingAngle={3} label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {categoryValueData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => fmt(Number(v))} contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border-light)', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="panel">
          <div className="panel-header"><div className="panel-title">Supplier Performance Matrix</div></div>
          <div style={{ padding: 16 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierPerf} layout="vertical" barSize={8} barGap={4}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--color-text-dim)', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="onTime" name="On-Time %" fill="#10b981" radius={[0, 3, 3, 0]} />
                <Bar dataKey="quality" name="Quality %" fill="#38bdf8" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="panel">
            <div className="panel-header"><div className="panel-title">Warehouse Utilization — All Facilities</div></div>
            <div style={{ padding: 20 }}>
              {warehouseUtilizationData.map((w, i) => (
                <div key={w.name} style={{ marginBottom: i < warehouseUtilizationData.length - 1 ? 16 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{w.name}</span>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Free: {w.free}%</span>
                      <span style={{ color: w.used > 85 ? 'var(--color-danger)' : w.used > 70 ? 'var(--color-warning)' : 'var(--color-success)' }}>Used: {w.used}%</span>
                    </div>
                  </div>
                  <div style={{ height: 10, background: 'var(--color-border)', borderRadius: 5 }}>
                    <div style={{ width: `${w.used}%`, height: '100%', borderRadius: 5, background: w.used > 85 ? 'var(--color-danger)' : w.used > 70 ? 'var(--color-warning)' : 'var(--color-success)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 4 && (
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Inventory Valuation Report</div>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>Real-time Valuation breakdown</span>
          </div>
          <table className="data-table">
            <thead><tr>
              <th>Category</th><th>Total Value (Cost)</th><th>Total Value (MRP)</th><th>Potential Profit</th><th>Margin %</th><th>Share %</th>
            </tr></thead>
            <tbody>
              {[
                { cat: 'Electronics', cost: 5760000, mrp: 8249700, share: 31.3 },
                { cat: 'FMCG', cost: 6601000, mrp: 8541500, share: 35.8 },
                { cat: 'Pharmaceuticals', cost: 2362500, mrp: 3570000, share: 12.8 },
                { cat: 'Apparel', cost: 2240000, mrp: 5118400, share: 12.2 },
                { cat: 'Automotive', cost: 744000, mrp: 1054400, share: 4.0 },
                { cat: 'Industrial', cost: 704500, mrp: 986300, share: 3.8 },
              ].map(r => (
                <tr key={r.cat}>
                  <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{r.cat}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{fmt(r.cost)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{fmt(r.mrp)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-success)' }}>{fmt(r.mrp - r.cost)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-success)' }}>
                    {(((r.mrp - r.cost) / r.mrp) * 100).toFixed(1)}%
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 4, background: 'var(--color-border)', borderRadius: 2 }}>
                        <div style={{ width: `${r.share}%`, height: '100%', borderRadius: 2, background: 'var(--color-primary)' }} />
                      </div>
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>{r.share}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
