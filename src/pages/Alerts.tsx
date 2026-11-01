import React, { useState } from 'react'
import { AlertTriangle, Bell, Check, Clock, Package, Calendar, TrendingDown, ShoppingCart, ShieldCheck, CheckCircle2, XCircle, UserCheck } from 'lucide-react'
import { useData } from '../context/DataContext'

const alertIcons: Record<string, React.ElementType> = {
  low_stock: TrendingDown,
  out_of_stock: Package,
  expiry: Calendar,
  overstock: Package,
  pending_po: ShoppingCart,
  transfer: Package,
}

const severityConfig = {
  critical: { cls: 'badge-danger', color: 'var(--color-danger)', bg: 'rgba(244,63,94,0.06)', border: 'rgba(244,63,94,0.2)' },
  warning: { cls: 'badge-warning', color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)' },
  info: { cls: 'badge-primary', color: 'var(--color-primary)', bg: 'rgba(56,189,248,0.06)', border: 'rgba(56,189,248,0.2)' },
}

export default function Alerts() {
  const { alerts, approvalRequests, userRole, acknowledgeAlert, approveRequest, rejectRequest } = useData()
  const [filterSev, setFilterSev] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [showAcked, setShowAcked] = useState(false)
  const [activeTab, setActiveTab] = useState<'approvals' | 'alerts'>('approvals')

  const pendingApprovals = approvalRequests.filter(r => r.status === 'PENDING')

  const filtered = alerts.filter(a =>
    (filterSev === 'all' || a.severity === filterSev) &&
    (showAcked || !a.acknowledged)
  )

  const ackAll = () => alerts.forEach(a => acknowledgeAlert(a.id))

  const critCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length
  const warnCount = alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length
  const infoCount = alerts.filter(a => a.severity === 'info' && !a.acknowledged).length

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title font-bold text-xl flex items-center gap-2">
            Alerts & Admin Approval Center
            {pendingApprovals.length > 0 && (
              <span className="px-2.5 py-0.5 bg-rose-500 text-white font-mono font-bold text-xs rounded-full animate-pulse">
                {pendingApprovals.length} PENDING APPROVALS
              </span>
            )}
          </div>
          <div className="page-subtitle">
            {userRole === 'ADMIN' ? 'Review & Approve Employee change requests and system alerts' : 'View submitted change requests & active notifications'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all ${
              activeTab === 'approvals'
                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Admin Approvals ({pendingApprovals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all ${
              activeTab === 'alerts'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>System Alerts ({alerts.filter(a => !a.acknowledged).length})</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: ADMIN APPROVAL REQUESTS QUEUE --- */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Employee Change Approval Queue</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {userRole === 'ADMIN' 
                    ? 'As Administrator, review requests submitted by Employees. Approving executes changes to live database.' 
                    : 'Your submitted requests are pending Administrator review & approval.'}
                </p>
              </div>
            </div>

            {userRole === 'ADMIN' && (
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
                ADMIN PRIVILEGE ACTIVE
              </span>
            )}
          </div>

          {approvalRequests.length === 0 && (
            <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
              <p className="font-bold text-sm">No Pending Approval Requests</p>
              <p className="text-xs text-slate-500">All employee modifications are up to date and approved.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {approvalRequests.map(req => (
              <div 
                key={req.id}
                className={`p-4 rounded-xl border transition-all ${
                  req.status === 'PENDING'
                    ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-950/20'
                    : req.status === 'APPROVED'
                    ? 'bg-slate-900/50 border-emerald-500/30 opacity-80'
                    : 'bg-slate-900/40 border-rose-500/30 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-extrabold uppercase font-mono px-2.5 py-0.5 rounded-full border ${
                        req.status === 'PENDING' 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                          : req.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-xs font-bold text-indigo-400 font-mono bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-800/40">
                        {req.actionType}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Requested by: <strong>{req.requestedBy}</strong> ({req.timestamp})
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white pt-1">{req.title}</h4>
                    <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {req.details}
                    </p>
                  </div>

                  {/* Actions */}
                  {req.status === 'PENDING' && (
                    <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                      {userRole === 'ADMIN' ? (
                        <>
                          <button
                            onClick={() => rejectRequest(req.id)}
                            className="px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            Reject
                          </button>
                          <button
                            onClick={() => approveRequest(req.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                            Approve & Execute
                          </button>
                        </>
                      ) : (
                        <div className="text-xs text-amber-400 font-mono font-bold flex items-center gap-1 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-800/40">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          Awaiting Admin
                        </div>
                      )}
                    </div>
                  )}

                  {req.status !== 'PENDING' && (
                    <div className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1 pt-1">
                      {req.status === 'APPROVED' ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Executed & Live
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Rejected
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: SYSTEM ALERTS --- */}
      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" checked={showAcked} onChange={e => setShowAcked(e.target.checked)} />
                Show acknowledged
              </label>
            </div>
            <button className="btn-ghost" onClick={ackAll}><Check size={13} /> Acknowledge All</button>
          </div>

          {filtered.length === 0 && (
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Bell size={28} style={{ marginBottom: 10, opacity: 0.3, marginLeft: 'auto', marginRight: 'auto' }} />
              <div style={{ fontSize: 14 }}>No alerts to display</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>All system parameters operating within normal thresholds</div>
            </div>
          )}

          {filtered.map(alert => {
            const cfg = severityConfig[alert.severity]
            const Icon = alertIcons[alert.type] || Bell
            return (
              <div key={alert.id} style={{
                background: alert.acknowledged ? 'var(--color-card)' : cfg.bg,
                border: `1px solid ${alert.acknowledged ? 'var(--color-border)' : cfg.border}`,
                borderRadius: 10, padding: '14px 18px',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                opacity: alert.acknowledged ? 0.6 : 1,
                transition: 'opacity 0.2s',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  background: cfg.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span className={`badge ${cfg.cls}`}>{alert.severity.toUpperCase()}</span>
                    {alert.product && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>{alert.product}</span>}
                    {alert.warehouse && <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>· {alert.warehouse}</span>}
                    {alert.acknowledged && <span className="badge badge-muted">Acknowledged</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-dim)', lineHeight: 1.5 }}>{alert.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> {alert.timestamp}
                  </div>
                </div>
                {!alert.acknowledged && (
                  <button onClick={() => acknowledgeAlert(alert.id)} className="btn-ghost" style={{ fontSize: 11, flexShrink: 0 }}>
                    <Check size={12} /> Ack
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
