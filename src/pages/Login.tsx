import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Warehouse, ShieldCheck, Lock, UserCheck, HardHat, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { useData, type PortalRole } from '../context/DataContext'

export default function Login() {
  const navigate = useNavigate()
  const { loginAs } = useData()

  const [selectedRole, setSelectedRole] = useState<PortalRole>('ADMIN')
  const [email, setEmail] = useState('admin@siwms.io')
  const [password, setPassword] = useState('Admin@2024')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRoleSelect = (role: PortalRole) => {
    setSelectedRole(role)
    if (role === 'ADMIN') {
      setEmail('admin@siwms.io')
      setPassword('Admin@2024')
    } else {
      setEmail('employee@siwms.io')
      setPassword('Staff@2024')
    }
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      loginAs(selectedRole, email)
      navigate('/')
      setLoading(false)
    }, 700)
  }

  const handleQuickDemoLogin = (role: PortalRole) => {
    setLoading(true)
    setTimeout(() => {
      loginAs(role, role === 'ADMIN' ? 'admin@siwms.io' : 'employee@siwms.io')
      navigate('/')
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#080f1e] text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Left Branding Showcase Panel */}
      <div className="flex-1 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#0d1b35] via-[#091326] to-[#080f1e] border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Subtle Ambient Glow & Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3.5 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Warehouse className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-white">SIWMS</div>
              <div className="text-[10px] font-mono text-sky-400 font-bold tracking-widest uppercase">
                ENTERPRISE WAREHOUSE OS
              </div>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Dual-Portal <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Smart Inventory OS
            </span>
          </h1>

          <p className="text-slate-400 text-base max-w-lg mb-8 leading-relaxed">
            Choose your authorized access gateway below. Administrators get full executive governance & BI analytics, while Employees access real-time stock check-in/out, transfers, and optical barcode scanning.
          </p>

          {/* Role Access Capabilities Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mb-10">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
                <UserCheck className="w-4 h-4" />
                Administrator Portal
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Catalog & SKU Registration</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> User RBAC & Access Controls</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> PO & SO Approval Pipeline</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Financial Analytics & Exports</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-2">
                <HardHat className="w-4 h-4" />
                Employee / Staff Portal
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Optical Barcode Camera Scanner</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant Stock In (+1) / Out (-1)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Intra-Warehouse Transfers</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> QR Code Smart Tag Printing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="relative z-10 flex items-center gap-8 pt-6 border-t border-slate-800/60">
          <div>
            <div className="text-lg font-bold font-mono text-white">740+ SKUs</div>
            <div className="text-xs text-slate-500">Live Inventory</div>
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-white">5 Hubs</div>
            <div className="text-xs text-slate-500">Active Warehouses</div>
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-emerald-400">99.9%</div>
            <div className="text-xs text-slate-500">Real-time Uptime</div>
          </div>
        </div>
      </div>

      {/* Right Login Authentication Form Panel */}
      <div className="w-full lg:w-[480px] p-8 lg:p-12 bg-slate-900 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              AUTHENTICATION GATEWAY
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In to SIWMS</h2>
            <p className="text-xs text-slate-400 mt-1">Select your access portal to enter the workspace</p>
          </div>

          {/* Portal Selector Toggle Tabs */}
          <div className="mb-6">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
              Select Login Portal Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleRoleSelect('ADMIN')}
                className={`py-3 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'ADMIN'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Admin Portal</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">Full Control</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('EMPLOYEE')}
                className={`py-3 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'EMPLOYEE'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <HardHat className="w-4 h-4" />
                  <span>Employee Portal</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">Staff Ops</span>
              </button>
            </div>
          </div>

          {/* Fast 1-Click Demo Logins */}
          <div className="mb-6 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                1-Click Quick Demo Login:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className="px-3 py-2 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Enter as Admin
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('EMPLOYEE')}
                className="px-3 py-2 bg-sky-950/50 hover:bg-sky-900/60 text-sky-300 border border-sky-800/60 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <HardHat className="w-3.5 h-3.5" />
                Enter as Employee
              </button>
            </div>
          </div>

          {/* Custom Credentials Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider font-mono">
                {selectedRole === 'ADMIN' ? 'Admin Email Address' : 'Employee Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={selectedRole === 'ADMIN' ? 'admin@siwms.io' : 'employee@siwms.io'}
                className="w-full px-3.5 py-2.5 bg-white text-black font-bold rounded-xl text-sm border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider font-mono">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white text-black font-bold rounded-xl text-sm border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-400 text-xs rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'ADMIN'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-600/20'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/20'
              }`}
            >
              {loading ? (
                <span>Authenticating Portal...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In as {selectedRole === 'ADMIN' ? 'Administrator' : 'Employee Staff'}
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 text-center text-[11px] text-slate-500 font-mono">
            Protected by Spring Security JWT & Multi-Tenant Portal Access
          </div>
        </div>
      </div>
    </div>
  )
}
