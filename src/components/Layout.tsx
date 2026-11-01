import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Layers, ShoppingCart, TrendingUp,
  Warehouse, Users, BarChart2, Bell, LogOut, ChevronLeft,
  ChevronRight, Truck, ArrowLeftRight, Scan, Upload, Download, Sparkles,
  ShieldCheck, HardHat
} from 'lucide-react'
import { useData } from '../context/DataContext'
import LiveSyncIndicator from './LiveSyncIndicator'
import BarcodeModal from './BarcodeModal'
import BarcodeScannerModal from './BarcodeScannerModal'
import ImportModal from './ImportModal'
import ExportModal from './ExportModal'
import AICopilotDrawer from './AICopilotDrawer'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/alerts', icon: Bell, label: 'Alerts', isAlertBadge: true },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { to: '/products', icon: Package, label: 'Products' },
      { to: '/inventory', icon: Layers, label: 'Inventory' },
      { to: '/transfers', icon: ArrowLeftRight, label: 'Transfers' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/purchase-orders', icon: ShoppingCart, label: 'Purchase Orders' },
      { to: '/sales-orders', icon: TrendingUp, label: 'Sales Orders' },
      { to: '/suppliers', icon: Truck, label: 'Suppliers' },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/warehouses', icon: Warehouse, label: 'Warehouses' },
      { to: '/reports', icon: BarChart2, label: 'Reports & Analytics' },
      { to: '/users', icon: Users, label: 'User Management' },
    ],
  },
]

interface LayoutProps { children: React.ReactNode }

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const { userRole, currentUser, logout, alerts, openScannerModal, openImportModal, openExportModal } = useData()

  const unreadAlerts = alerts.filter(a => !a.acknowledged).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 60 : 220,
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 20
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 14px 14px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 10, justifyContent: collapsed ? 'center' : 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: userRole === 'ADMIN' ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: userRole === 'ADMIN' ? '0 4px 12px rgba(244,63,94,0.3)' : '0 4px 12px rgba(14,165,233,0.3)'
            }}>
              <Warehouse size={16} color="#ffffff" strokeWidth={2.5} />
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1 }}>SIWMS</div>
                <div style={{ fontSize: 9, color: userRole === 'ADMIN' ? '#f43f5e' : '#38bdf8', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', fontWeight: 700 }}>
                  {userRole === 'ADMIN' ? 'ADMIN PORTAL' : 'EMPLOYEE PORTAL'}
                </div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 2, display: 'flex' }}>
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {navGroups.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 4 }}>
                  {group.label}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {group.items.map(item => {
                  const badgeCount = item.isAlertBadge ? unreadAlerts : 0
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      title={collapsed ? item.label : undefined}
                      style={{ justifyContent: collapsed ? 'center' : undefined, position: 'relative' }}
                    >
                      <item.icon className="icon" size={16} />
                      {!collapsed && <span>{item.label}</span>}
                      {!collapsed && badgeCount > 0 ? (
                        <span style={{
                          marginLeft: 'auto', background: 'var(--color-danger)', color: '#fff',
                          borderRadius: 10, fontSize: 10, fontWeight: 700,
                          padding: '1px 6px', fontFamily: 'var(--font-mono)',
                        }}>{badgeCount}</span>
                      ) : null}
                      {collapsed && badgeCount > 0 ? (
                        <span style={{
                          position: 'absolute', top: 4, right: 4,
                          background: 'var(--color-danger)', width: 7, height: 7, borderRadius: '50%',
                        }} />
                      ) : null}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User profile */}
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '12px 8px' }}>
          {collapsed ? (
            <div onClick={() => setCollapsed(false)} style={{
              width: 32, height: 32, borderRadius: 8,
              background: userRole === 'ADMIN' ? '#f43f5e22' : '#38bdf822',
              color: userRole === 'ADMIN' ? '#f43f5e' : '#38bdf8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, cursor: 'pointer', margin: '0 auto',
            }}>{currentUser.avatar}</div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px', borderRadius: 8, marginBottom: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: userRole === 'ADMIN' ? '#f43f5e22' : '#38bdf822',
                  color: userRole === 'ADMIN' ? '#f43f5e' : '#38bdf8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{currentUser.avatar}</div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</div>
                  <div style={{ fontSize: 10, color: userRole === 'ADMIN' ? '#f43f5e' : '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    {userRole === 'ADMIN' ? 'Administrator' : 'Employee Staff'}
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} className="sidebar-item" style={{ width: '100%', color: '#f43f5e' }}>
                <LogOut size={14} />
                <span>Sign Out Portal</span>
              </button>
            </div>
          )}
          {collapsed && (
            <button onClick={() => setCollapsed(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '6px 0', marginTop: 4,
            }}>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 56, background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 10,
        }}>
          {/* Live Sync Status Bar */}
          <div className="flex items-center gap-3">
            <LiveSyncIndicator />
            {/* Active Portal Mode Pill */}
            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border ${
              userRole === 'ADMIN' 
                ? 'bg-rose-950/40 text-rose-400 border-rose-800/60' 
                : 'bg-sky-950/40 text-sky-400 border-sky-800/60'
            }`}>
              {userRole === 'ADMIN' ? <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> : <HardHat className="w-3.5 h-3.5 text-sky-400" />}
              <span>{userRole === 'ADMIN' ? 'ADMIN PORTAL (FULL ACCESS)' : 'EMPLOYEE PORTAL (STAFF OPS)'}</span>
            </div>
          </div>

          {/* Quick Action Toolbar (Barcode Scan, Import, Export) */}
          <div className="flex items-center gap-2">
            {/* Quick Barcode Scanner Button */}
            <button
              onClick={openScannerModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
              title="Open Optical Barcode Scanner"
            >
              <Scan className="w-3.5 h-3.5 text-indigo-400" />
              <span>Scan Barcode</span>
            </button>

            {/* Quick Import Button */}
            <button
              onClick={openImportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs rounded-xl transition-all"
              title="Import CSV/JSON Data"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Import</span>
            </button>

            {/* Quick Export Button */}
            <button
              onClick={openExportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold text-xs rounded-xl transition-all"
              title="Export CSV, JSON, PDF"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </header>

        {/* View container */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </div>
      </main>

      {/* Global Interactive Modals */}
      <BarcodeModal />
      <BarcodeScannerModal />
      <ImportModal />
      <ExportModal />
      <AICopilotDrawer />
    </div>
  )
}
