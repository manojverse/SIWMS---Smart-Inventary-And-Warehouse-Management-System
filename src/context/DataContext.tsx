import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type {
  Product, InventoryItem, Category, PurchaseOrder, SalesOrder,
  Warehouse, Supplier, StockTransfer, Alert, SyncLogEntry, ApprovalRequest, ApprovalActionType
} from '../types'
import {
  products as initialProducts,
  inventory as initialInventory,
  categories as initialCategories,
  purchaseOrders as initialPOs,
  salesOrders as initialSOs,
  warehouses as initialWarehouses,
  suppliers as initialSuppliers,
  transfers as initialTransfers,
  alerts as initialAlerts,
} from '../data/mockData'
import { exportToCSV, exportToJSON, exportToPrintablePDF } from '../utils/exportImportUtils'

export type PortalRole = 'ADMIN' | 'EMPLOYEE'

export interface UserSession {
  name: string
  email: string
  role: PortalRole
  avatar: string
  title: string
}

interface DataContextType {
  products: Product[]
  inventory: InventoryItem[]
  categories: Category[]
  purchaseOrders: PurchaseOrder[]
  salesOrders: SalesOrder[]
  warehouses: Warehouse[]
  suppliers: Supplier[]
  transfers: StockTransfer[]
  alerts: Alert[]
  syncLogs: SyncLogEntry[]
  approvalRequests: ApprovalRequest[]
  
  // Auth Session
  userRole: PortalRole
  currentUser: UserSession
  loginAs: (role: PortalRole, email?: string) => void
  logout: () => void

  isSyncing: boolean
  isLiveMode: boolean
  lastSyncedTime: string
  syncLatency: number

  // Modal controls
  isBarcodeModalOpen: boolean
  activeBarcodeItem: { name: string; sku: string; barcode: string; price?: number } | null
  isScannerOpen: boolean
  isImportOpen: boolean
  isExportOpen: boolean
  isActivityLogOpen: boolean

  // Handlers
  openBarcodeModal: (item: { name: string; sku: string; barcode: string; price?: number }) => void
  closeBarcodeModal: () => void
  openScannerModal: () => void
  closeScannerModal: () => void
  openImportModal: () => void
  closeImportModal: () => void
  openExportModal: () => void
  closeExportModal: () => void
  toggleActivityLog: () => void
  setActivityLogOpen: (open: boolean) => void

  // Admin Approval Queue Handlers
  approveRequest: (requestId: string) => void
  rejectRequest: (requestId: string) => void

  // Data Mutators
  addProduct: (product: Omit<Product, 'id'>) => { approved: boolean; message: string }
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => { approved: boolean; message: string }
  adjustStockQuantity: (inventoryId: number, change: number, reason: string) => { approved: boolean; message: string }
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber'>) => { approved: boolean; message: string }
  createSalesOrder: (so: Omit<SalesOrder, 'id' | 'soNumber'>) => { approved: boolean; message: string }
  createStockTransfer: (transfer: Omit<StockTransfer, 'id' | 'transferNo'>) => { approved: boolean; message: string }
  acknowledgeAlert: (id: number) => void
  resetToDemoData: () => void

  // Live Sync & Import/Export
  triggerManualSync: () => Promise<void>
  toggleLiveMode: () => void
  importItems: (entityType: 'products' | 'inventory' | 'suppliers' | 'orders', rows: Record<string, any>[]) => { successCount: number; failCount: number }
  exportData: (entityType: 'products' | 'inventory' | 'purchaseOrders' | 'salesOrders' | 'suppliers' | 'transfers', format: 'csv' | 'json' | 'pdf') => void
  lookupByBarcodeOrSKU: (query: string) => Product | InventoryItem | null
  addSyncLog: (type: SyncLogEntry['type'], title: string, detail: string, status?: SyncLogEntry['status']) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const ADMIN_USER: UserSession = {
  name: 'Rajesh Sharma (Admin)',
  email: 'admin@siwms.io',
  role: 'ADMIN',
  avatar: 'RS',
  title: 'System Administrator & Operations Director'
}

const EMPLOYEE_USER: UserSession = {
  name: 'Priya Verma (Staff)',
  email: 'employee@siwms.io',
  role: 'EMPLOYEE',
  avatar: 'PV',
  title: 'Senior Inventory & Warehouse Staff'
}

const INITIAL_APPROVAL_REQUESTS: ApprovalRequest[] = [
  {
    id: 'req-101',
    actionType: 'ADD_PRODUCT',
    title: 'Add New Product Registration: Sony BRAVIA 4K Smart TV',
    details: 'SKU: ELEC-990 | Selling Price: ₹48,990 | Category: Electronics',
    requestedBy: 'Priya Verma (Staff)',
    requestedRole: 'EMPLOYEE',
    timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
    status: 'PENDING',
    payload: {
      sku: 'ELEC-990',
      barcode: '8901234990123',
      name: 'Sony BRAVIA 4K Smart TV 55"',
      category: 'Electronics',
      supplier: 'TechSource Global Pvt Ltd',
      unit: 'Piece',
      costPrice: 38000,
      sellingPrice: 48990,
      reorderLevel: 10,
      maxStock: 100,
      status: 'Active',
      expiryTracked: false
    }
  },
  {
    id: 'req-102',
    actionType: 'STOCK_ADJUST',
    title: 'Rapid Stock Adjustment (+50 units)',
    details: 'Product: Paracetamol 500mg (Delhi Central Hub)',
    requestedBy: 'Suresh Kumar (Staff)',
    requestedRole: 'EMPLOYEE',
    timestamp: new Date(Date.now() - 7200000).toLocaleTimeString(),
    status: 'PENDING',
    payload: {
      inventoryId: 3,
      change: 50,
      reason: 'Physical Audit Check-In'
    }
  }
]

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth Session State
  const [userRole, setUserRole] = useState<PortalRole>(() => {
    return (localStorage.getItem('siwms_role') as PortalRole) || 'ADMIN'
  })
  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    return userRole === 'EMPLOYEE' ? EMPLOYEE_USER : ADMIN_USER
  })

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('siwms_products')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return initialProducts
  })
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('siwms_inventory')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return initialInventory
  })
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem('siwms_pos')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return initialPOs
  })
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => {
    try {
      const saved = localStorage.getItem('siwms_sos')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return initialSOs
  })
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses)
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [transfers, setTransfers] = useState<StockTransfer[]>(initialTransfers)
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)

  // Approval Requests Queue
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(() => {
    try {
      const saved = localStorage.getItem('siwms_approvals')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {}
    return INITIAL_APPROVAL_REQUESTS
  })

  // Sync Engine State
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLiveMode, setIsLiveMode] = useState(true)
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(new Date().toLocaleTimeString())
  const [syncLatency, setSyncLatency] = useState(28)
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'sync',
      title: 'Real-time Gateway Connected',
      detail: 'WebSocket handshake established with node wh-gateway-01.siwms.internal',
      status: 'success'
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'barcode',
      title: 'Barcode Engine Initialized',
      detail: 'Ready for Code128 & QR code camera scanner input',
      status: 'info'
    }
  ])

  // Modals state
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false)
  const [activeBarcodeItem, setActiveBarcodeItem] = useState<{ name: string; sku: string; barcode: string; price?: number } | null>(null)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false)

  // Persist local state
  useEffect(() => { localStorage.setItem('siwms_products', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('siwms_inventory', JSON.stringify(inventory)) }, [inventory])
  useEffect(() => { localStorage.setItem('siwms_pos', JSON.stringify(purchaseOrders)) }, [purchaseOrders])
  useEffect(() => { localStorage.setItem('siwms_sos', JSON.stringify(salesOrders)) }, [salesOrders])
  useEffect(() => { localStorage.setItem('siwms_approvals', JSON.stringify(approvalRequests)) }, [approvalRequests])

  const addSyncLog = useCallback((type: SyncLogEntry['type'], title: string, detail: string, status: SyncLogEntry['status'] = 'info') => {
    const newLog: SyncLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      title,
      detail,
      status
    }
    setSyncLogs(prev => [newLog, ...prev.slice(0, 49)])
  }, [])

  const loginAs = (role: PortalRole, email?: string) => {
    setUserRole(role)
    localStorage.setItem('siwms_role', role)
    if (role === 'EMPLOYEE') {
      setCurrentUser({
        ...EMPLOYEE_USER,
        email: email || EMPLOYEE_USER.email
      })
      addSyncLog('sync', 'Logged In as Employee', `User session activated: Employee / Staff Portal`, 'info')
    } else {
      setCurrentUser({
        ...ADMIN_USER,
        email: email || ADMIN_USER.email
      })
      addSyncLog('sync', 'Logged In as Administrator', `User session activated: Administrator Portal`, 'success')
    }
  }

  const logout = () => {
    addSyncLog('sync', 'User Logged Out', `Session ended for ${currentUser.name}`, 'warning')
  }

  const resetToDemoData = () => {
    localStorage.removeItem('siwms_products')
    localStorage.removeItem('siwms_inventory')
    localStorage.removeItem('siwms_pos')
    localStorage.removeItem('siwms_sos')
    localStorage.removeItem('siwms_approvals')
    setProducts(initialProducts)
    setInventory(initialInventory)
    setPurchaseOrders(initialPOs)
    setSalesOrders(initialSOs)
    setApprovalRequests(INITIAL_APPROVAL_REQUESTS)
    addSyncLog('sync', 'State Restored to Demo Seed Data', 'Restored 8 core products, stock entries, and orders', 'success')
  }

  // Live periodic simulation sync
  useEffect(() => {
    if (!isLiveMode) return
    const interval = setInterval(() => {
      const randomLatency = Math.floor(Math.random() * 20) + 15
      setSyncLatency(randomLatency)
      setLastSyncedTime(new Date().toLocaleTimeString())

      if (Math.random() < 0.25) {
        setInventory(prev => {
          if (prev.length === 0) return prev
          const randomIndex = Math.floor(Math.random() * prev.length)
          const target = prev[randomIndex]
          const delta = Math.random() > 0.4 ? 1 : -1
          const newQty = Math.max(0, target.quantity + delta)
          const newAvail = Math.max(0, target.available + delta)
          
          let newStatus = target.status
          if (newQty === 0) newStatus = 'Out of Stock'
          else if (newQty < target.reorderLevel) newStatus = 'Low Stock'
          else if (newQty > target.maxStock) newStatus = 'Overstock'
          else newStatus = 'In Stock'

          addSyncLog('stock', `Live Stock Shift: ${target.product}`, `Qty updated to ${newQty} in ${target.warehouse}`, 'info')

          return prev.map((item, idx) => idx === randomIndex ? {
            ...item,
            quantity: newQty,
            available: newAvail,
            status: newStatus,
            lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
          } : item)
        })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [isLiveMode, addSyncLog])

  const triggerManualSync = async () => {
    setIsSyncing(true)
    addSyncLog('sync', 'Manual Cloud Sync Triggered', 'Initiating full bi-directional state sync with database...', 'info')
    
    await new Promise(res => setTimeout(res, 1200))
    
    setLastSyncedTime(new Date().toLocaleTimeString())
    setIsSyncing(false)
    addSyncLog('sync', 'Cloud Sync Completed', 'Database & cache in perfect 1:1 synchronization.', 'success')
  }

  const toggleLiveMode = () => {
    setIsLiveMode(prev => {
      const next = !prev
      addSyncLog('sync', `Live Mode ${next ? 'Activated' : 'Paused'}`, `Real-time WebSocket streaming ${next ? 'enabled' : 'disabled'}`, next ? 'success' : 'warning')
      return next
    })
  }

  const openBarcodeModal = (item: { name: string; sku: string; barcode: string; price?: number }) => {
    setActiveBarcodeItem(item)
    setIsBarcodeModalOpen(true)
    addSyncLog('barcode', `Barcode Viewer Opened`, `Generated Code128 tag for ${item.sku}`, 'info')
  }
  const closeBarcodeModal = () => setIsBarcodeModalOpen(false)

  const openScannerModal = () => setIsScannerOpen(true)
  const closeScannerModal = () => setIsScannerOpen(false)
  const openImportModal = () => setIsImportOpen(true)
  const closeImportModal = () => setIsImportOpen(false)
  const openExportModal = () => setIsExportOpen(true)
  const closeExportModal = () => setIsExportOpen(false)
  const toggleActivityLog = () => setIsActivityLogOpen(prev => !prev)
  const setActivityLogOpen = (open: boolean) => setIsActivityLogOpen(open)

  // Direct Execution Core Functions (Used by Admin or upon Approval)
  const executeAddProduct = (prod: Omit<Product, 'id'>) => {
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1
    const newProduct: Product = { ...prod, id: newId }
    setProducts(prev => [newProduct, ...prev])
    addSyncLog('stock', `Product Created: ${newProduct.name}`, `SKU: ${newProduct.sku} added to catalog`, 'success')
  }

  const executeDeleteProduct = (id: number) => {
    const target = products.find(p => p.id === id)
    setProducts(prev => prev.filter(p => p.id !== id))
    addSyncLog('stock', `Product Deleted`, `SKU ${target?.sku || id} removed from catalog`, 'warning')
  }

  const executeAdjustStockQuantity = (inventoryId: number, change: number, reason: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id !== inventoryId) return item
      const newQty = Math.max(0, item.quantity + change)
      const newAvail = Math.max(0, item.available + change)
      
      let newStatus = item.status
      if (newQty === 0) newStatus = 'Out of Stock'
      else if (newQty < item.reorderLevel) newStatus = 'Low Stock'
      else if (newQty > item.maxStock) newStatus = 'Overstock'
      else newStatus = 'In Stock'

      return {
        ...item,
        quantity: newQty,
        available: newAvail,
        status: newStatus,
        lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
      }
    }))

    const targetItem = inventory.find(i => i.id === inventoryId)
    addSyncLog('stock', `Manual Stock Adjustment`, `${change >= 0 ? '+' : ''}${change} units for ${targetItem?.sku || inventoryId} (${reason})`, change >= 0 ? 'success' : 'warning')
  }

  const executeCreatePO = (poData: Omit<PurchaseOrder, 'id' | 'poNumber'>) => {
    const newId = purchaseOrders.length ? Math.max(...purchaseOrders.map(p => p.id)) + 1 : 1
    const poNumber = `PO-2024-${String(840 + newId).padStart(4, '0')}`
    const newPO: PurchaseOrder = { ...poData, id: newId, poNumber }
    setPurchaseOrders(prev => [newPO, ...prev])
    addSyncLog('order', `PO Created: ${poNumber}`, `Supplier: ${poData.supplier} | Total: ₹${poData.totalAmount.toLocaleString()}`, 'success')
  }

  const executeCreateSO = (soData: Omit<SalesOrder, 'id' | 'soNumber'>) => {
    const newId = salesOrders.length ? Math.max(...salesOrders.map(s => s.id)) + 1 : 1
    const soNumber = `SO-2024-${String(1520 + newId).padStart(4, '0')}`
    const newSO: SalesOrder = { ...soData, id: newId, soNumber }
    setSalesOrders(prev => [newSO, ...prev])
    addSyncLog('order', `Sales Order Created: ${soNumber}`, `Customer: ${soData.customer} | Total: ₹${soData.total.toLocaleString()}`, 'success')
  }

  const executeCreateTransfer = (transferData: Omit<StockTransfer, 'id' | 'transferNo'>) => {
    const newId = transfers.length ? Math.max(...transfers.map(t => t.id)) + 1 : 1
    const transferNo = `TRF-2024-${String(130 + newId).padStart(4, '0')}`
    const newTrf: StockTransfer = { ...transferData, id: newId, transferNo }
    setTransfers(prev => [newTrf, ...prev])
    addSyncLog('stock', `Transfer Initiated: ${transferNo}`, `${transferData.quantity} units of ${transferData.product} from ${transferData.fromWarehouse} to ${transferData.toWarehouse}`, 'info')
  }

  // Admin Approval Queue Controls
  const approveRequest = (requestId: string) => {
    const req = approvalRequests.find(r => r.id === requestId)
    if (!req) return

    setApprovalRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'APPROVED' } : r))

    // Execute requested payload
    if (req.actionType === 'ADD_PRODUCT') executeAddProduct(req.payload)
    else if (req.actionType === 'DELETE_PRODUCT') executeDeleteProduct(req.payload.id)
    else if (req.actionType === 'STOCK_ADJUST') executeAdjustStockQuantity(req.payload.inventoryId, req.payload.change, req.payload.reason)
    else if (req.actionType === 'CREATE_PO') executeCreatePO(req.payload)
    else if (req.actionType === 'CREATE_SO') executeCreateSO(req.payload)
    else if (req.actionType === 'STOCK_TRANSFER') executeCreateTransfer(req.payload)

    addSyncLog('sync', `Admin Approved Request`, `Approved: "${req.title}" submitted by ${req.requestedBy}`, 'success')
  }

  const rejectRequest = (requestId: string) => {
    const req = approvalRequests.find(r => r.id === requestId)
    if (!req) return

    setApprovalRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'REJECTED' } : r))
    addSyncLog('sync', `Admin Rejected Request`, `Rejected: "${req.title}" submitted by ${req.requestedBy}`, 'warning')
  }

  // Employee Approval Wrapper Handler
  const submitOrExecute = (actionType: ApprovalActionType, title: string, details: string, payload: any, executeFn: () => void) => {
    if (userRole === 'ADMIN') {
      executeFn()
      return { approved: true, message: 'Action executed successfully by Administrator.' }
    } else {
      const newReq: ApprovalRequest = {
        id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        actionType,
        title,
        details,
        requestedBy: currentUser.name,
        requestedRole: 'EMPLOYEE',
        timestamp: new Date().toLocaleTimeString(),
        status: 'PENDING',
        payload
      }
      setApprovalRequests(prev => [newReq, ...prev])
      
      // Send Alert to Admin Queue
      setAlerts(prev => [{
        id: Date.now(),
        type: 'transfer',
        severity: 'warning',
        message: `Pending Employee Request: ${title}`,
        timestamp: new Date().toLocaleTimeString(),
        acknowledged: false
      }, ...prev])

      addSyncLog('sync', `Approval Request Submitted`, `${currentUser.name} requested Admin approval for: "${title}"`, 'warning')
      return { approved: false, message: 'Submitted for Admin Approval! Waiting for Administrator review.' }
    }
  }

  // Data Mutator Wrappers
  const addProduct = (prod: Omit<Product, 'id'>) => {
    return submitOrExecute(
      'ADD_PRODUCT',
      `Add Product Registration: ${prod.name}`,
      `SKU: ${prod.sku} | Price: ₹${prod.sellingPrice} | Category: ${prod.category}`,
      prod,
      () => executeAddProduct(prod)
    )
  }

  const updateProduct = (id: number, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p))
    addSyncLog('stock', `Product Updated`, `Item ID #${id} details modified`, 'info')
  }

  const deleteProduct = (id: number) => {
    const target = products.find(p => p.id === id)
    return submitOrExecute(
      'DELETE_PRODUCT',
      `Delete Product: ${target?.name || id}`,
      `SKU: ${target?.sku || id} requested for deletion from catalog`,
      { id },
      () => executeDeleteProduct(id)
    )
  }

  const adjustStockQuantity = (inventoryId: number, change: number, reason: string) => {
    const targetItem = inventory.find(i => i.id === inventoryId)
    return submitOrExecute(
      'STOCK_ADJUST',
      `Stock Adjustment (${change >= 0 ? '+' : ''}${change} units)`,
      `Product: ${targetItem?.product || inventoryId} (${targetItem?.warehouse}) | Reason: ${reason}`,
      { inventoryId, change, reason },
      () => executeAdjustStockQuantity(inventoryId, change, reason)
    )
  }

  const createPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber'>) => {
    return submitOrExecute(
      'CREATE_PO',
      `Create Purchase Order for ${poData.supplier}`,
      `Warehouse: ${poData.warehouse} | Amount: ₹${poData.totalAmount.toLocaleString()}`,
      poData,
      () => executeCreatePO(poData)
    )
  }

  const createSalesOrder = (soData: Omit<SalesOrder, 'id' | 'soNumber'>) => {
    return submitOrExecute(
      'CREATE_SO',
      `Create Sales Order for ${soData.customer}`,
      `Total: ₹${soData.total.toLocaleString()} | Items: ${soData.items}`,
      soData,
      () => executeCreateSO(soData)
    )
  }

  const createStockTransfer = (transferData: Omit<StockTransfer, 'id' | 'transferNo'>) => {
    return submitOrExecute(
      'STOCK_TRANSFER',
      `Stock Transfer (${transferData.quantity} units of ${transferData.product})`,
      `Route: ${transferData.fromWarehouse} ➔ ${transferData.toWarehouse}`,
      transferData,
      () => executeCreateTransfer(transferData)
    )
  }

  const acknowledgeAlert = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a))
    addSyncLog('sync', `Alert Acknowledged`, `Alert #${id} marked as resolved`, 'info')
  }

  const lookupByBarcodeOrSKU = (query: string): Product | InventoryItem | null => {
    const q = query.trim().toUpperCase()
    const foundProduct = products.find(p => p.sku.toUpperCase() === q || p.barcode === q)
    if (foundProduct) return foundProduct

    const foundInventory = inventory.find(i => i.sku.toUpperCase() === q)
    return foundInventory || null
  }

  // Import Engine
  const importItems = (entityType: 'products' | 'inventory' | 'suppliers' | 'orders', rows: Record<string, any>[]) => {
    let successCount = 0
    let failCount = 0

    if (entityType === 'products') {
      const newProds: Product[] = []
      rows.forEach(r => {
        if (r.sku && r.name) {
          newProds.push({
            id: Date.now() + Math.floor(Math.random() * 10000),
            sku: r.sku,
            barcode: r.barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            name: r.name,
            category: r.category || 'Electronics',
            supplier: r.supplier || 'Reliance Supply Chain',
            unit: r.unit || 'Piece',
            costPrice: Number(r.costPrice) || 100,
            sellingPrice: Number(r.sellingPrice) || 150,
            reorderLevel: Number(r.reorderLevel) || 20,
            maxStock: Number(r.maxStock) || 500,
            status: 'Active',
            expiryTracked: false
          })
          successCount++
        } else {
          failCount++
        }
      })
      if (newProds.length) setProducts(prev => [...newProds, ...prev])
    } else if (entityType === 'inventory') {
      const newInv: InventoryItem[] = []
      rows.forEach(r => {
        if (r.sku && r.product) {
          const qty = Number(r.quantity) || 0
          newInv.push({
            id: Date.now() + Math.floor(Math.random() * 10000),
            sku: r.sku,
            product: r.product,
            warehouse: r.warehouse || 'Delhi Central Hub',
            quantity: qty,
            reserved: Number(r.reserved) || 0,
            available: qty - (Number(r.reserved) || 0),
            reorderLevel: Number(r.reorderLevel) || 50,
            maxStock: Number(r.maxStock) || 1000,
            unit: r.unit || 'Piece',
            lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
            status: qty === 0 ? 'Out of Stock' : (qty < 50 ? 'Low Stock' : 'In Stock'),
            value: qty * 100
          })
          successCount++
        } else {
          failCount++
        }
      })
      if (newInv.length) setInventory(prev => [...newInv, ...prev])
    }

    addSyncLog('import', `Import Finished (${entityType.toUpperCase()})`, `Successfully imported ${successCount} records (${failCount} failed)`, successCount > 0 ? 'success' : 'error')
    return { successCount, failCount }
  }

  // Export Engine
  const exportData = (entityType: 'products' | 'inventory' | 'purchaseOrders' | 'salesOrders' | 'suppliers' | 'transfers', format: 'csv' | 'json' | 'pdf') => {
    let data: any[] = []
    let title = entityType.toUpperCase()

    if (entityType === 'products') data = products
    else if (entityType === 'inventory') data = inventory
    else if (entityType === 'purchaseOrders') data = purchaseOrders
    else if (entityType === 'salesOrders') data = salesOrders
    else if (entityType === 'suppliers') data = suppliers
    else if (entityType === 'transfers') data = transfers

    if (format === 'csv') {
      exportToCSV(entityType, data)
    } else if (format === 'json') {
      exportToJSON(entityType, data)
    } else if (format === 'pdf') {
      const cols = data.length ? Object.keys(data[0]).slice(0, 6).map(k => ({ header: k.toUpperCase(), accessor: k })) : []
      exportToPrintablePDF(`${title} REPORT`, cols, data)
    }

    addSyncLog('export', `Exported ${title}`, `Format: ${format.toUpperCase()} (${data.length} records)`, 'success')
  }

  return (
    <DataContext.Provider value={{
      products, inventory, categories, purchaseOrders, salesOrders, warehouses, suppliers, transfers, alerts, syncLogs, approvalRequests,
      userRole, currentUser, loginAs, logout, approveRequest, rejectRequest,
      isSyncing, isLiveMode, lastSyncedTime, syncLatency,
      isBarcodeModalOpen, activeBarcodeItem, isScannerOpen, isImportOpen, isExportOpen, isActivityLogOpen,
      openBarcodeModal, closeBarcodeModal, openScannerModal, closeScannerModal,
      openImportModal, closeImportModal, openExportModal, closeExportModal, toggleActivityLog, setActivityLogOpen,
      addProduct, updateProduct, deleteProduct, adjustStockQuantity,
      createPurchaseOrder, createSalesOrder, createStockTransfer, acknowledgeAlert, resetToDemoData,
      triggerManualSync, toggleLiveMode, importItems, exportData, lookupByBarcodeOrSKU, addSyncLog
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
