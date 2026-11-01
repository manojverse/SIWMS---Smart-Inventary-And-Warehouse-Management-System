import React from 'react'
import { Activity, RefreshCw, Radio, ShieldCheck, History, X } from 'lucide-react'
import { useData } from '../context/DataContext'

export default function LiveSyncIndicator() {
  const {
    isSyncing, isLiveMode, lastSyncedTime, syncLatency, syncLogs,
    triggerManualSync, toggleLiveMode, isActivityLogOpen, toggleActivityLog, setActivityLogOpen
  } = useData()

  return (
    <>
      {/* Top Header Live Status Bar Widget */}
      <div className="flex items-center gap-2">
        {/* Live Streaming Toggle Pill */}
        <button
          onClick={toggleLiveMode}
          title={isLiveMode ? "Real-time Live Sync Active (Click to Pause)" : "Live Sync Paused (Click to Enable)"}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
            isLiveMode
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
          }`}
        >
          <span className="relative flex h-2 w-2">
            {isLiveMode && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveMode ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </span>
          <span className="font-semibold hidden sm:inline">{isLiveMode ? 'LIVE SYNC' : 'SYNC PAUSED'}</span>
          <span className="text-[10px] opacity-75">({syncLatency}ms)</span>
        </button>

        {/* Force Manual Sync Button */}
        <button
          onClick={triggerManualSync}
          disabled={isSyncing}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          title={`Last Synced: ${lastSyncedTime}. Click to sync now.`}
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
        </button>

        {/* Live Event Audit Log Drawer Button */}
        <button
          onClick={toggleActivityLog}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-semibold transition-colors"
          title="Open Live Sync Activity Feed"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sync Log</span>
          <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {syncLogs.length}
          </span>
        </button>
      </div>

      {/* Slide-over Live Activity Log Drawer */}
      {isActivityLogOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-250">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm">Real-time Sync & Audit Log</h3>
                <p className="text-[11px] text-slate-400 font-mono">Live WebSocket Push Events</p>
              </div>
            </div>
            <button
              onClick={() => setActivityLogOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {syncLogs.map(log => (
              <div 
                key={log.id}
                className={`p-3 rounded-xl border ${
                  log.status === 'success'
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300'
                    : log.status === 'warning'
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300'
                    : log.status === 'error'
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] opacity-75 mb-1">
                  <span className="uppercase font-bold tracking-wider">{log.type}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="font-bold text-xs">{log.title}</div>
                <div className="text-[11px] mt-0.5 opacity-90">{log.detail}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Server Ping: {syncLatency}ms</span>
            <button
              onClick={triggerManualSync}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
            >
              Force Sync Now
            </button>
          </div>
        </div>
      )}
    </>
  )
}
