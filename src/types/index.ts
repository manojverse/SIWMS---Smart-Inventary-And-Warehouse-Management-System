export type UserRole =
  | 'ADMIN'
  | 'WAREHOUSE_MANAGER'
  | 'INVENTORY_STAFF'
  | 'PROCUREMENT_OFFICER'
  | 'SALES_EXECUTIVE'
  | 'FINANCE_MANAGER'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  warehouse?: string
  status: 'Active' | 'Inactive'
  lastLogin: string
  avatar: string
}

export interface Category {
  id: number
  name: string
  code: string
  description: string
  productCount: number
}

export interface Warehouse {
  id: number
  code: string
  name: string
  location: string
  city: string
  capacity: number
  used: number
  manager: string
  status: 'Active' | 'Inactive'
  temperature?: string
}

export interface Supplier {
  id: number
  code: string
  name: string
  contact: string
  email: string
  phone: string
  city: string
  country: string
  rating: number
  totalOrders: number
  onTimeDelivery: number
  status: 'Active' | 'Inactive'
  balance: number
}

export interface Product {
  id: number
  sku: string
  barcode: string
  name: string
  category: string
  supplier: string
  unit: string
  costPrice: number
  sellingPrice: number
  reorderLevel: number
  maxStock: number
  image?: string
  status: 'Active' | 'Inactive'
  expiryTracked: boolean
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Overstock'

export interface InventoryItem {
  id: number
  product: string
  sku: string
  warehouse: string
  quantity: number
  reserved: number
  available: number
  reorderLevel: number
  maxStock: number
  unit: string
  lastUpdated: string
  status: StockStatus
  batchNo?: string
  expiryDate?: string
  value: number
}

export type POStatus = 'Draft' | 'Pending' | 'Approved' | 'Ordered' | 'Received' | 'Cancelled'

export interface PurchaseOrder {
  id: number
  poNumber: string
  supplier: string
  warehouse: string
  status: POStatus
  orderDate: string
  expectedDate: string
  receivedDate?: string
  items: number
  totalAmount: number
  paidAmount: number
  createdBy: string
}

export type SOStatus = 'Draft' | 'Confirmed' | 'Picking' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'

export interface SalesOrder {
  id: number
  soNumber: string
  customer: string
  warehouse: string
  status: SOStatus
  orderDate: string
  shipDate?: string
  deliveredDate?: string
  items: number
  subtotal: number
  tax: number
  total: number
  salesRep: string
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid'
}

export interface Alert {
  id: number
  type: 'low_stock' | 'expiry' | 'overstock' | 'pending_po' | 'transfer'
  severity: 'critical' | 'warning' | 'info'
  product?: string
  warehouse?: string
  message: string
  timestamp: string
  acknowledged: boolean
}

export interface StockTransfer {
  id: number
  transferNo: string
  fromWarehouse: string
  toWarehouse: string
  product: string
  quantity: number
  status: 'Pending' | 'Approved' | 'In Transit' | 'Received' | 'Cancelled'
  requestedBy: string
  approvedBy?: string
  requestDate: string
  completedDate?: string
}

export interface SyncLogEntry {
  id: string
  timestamp: string
  type: 'sync' | 'barcode' | 'import' | 'export' | 'stock' | 'order'
  title: string
  detail: string
  status: 'success' | 'warning' | 'error' | 'info'
}

export type ApprovalActionType = 
  | 'ADD_PRODUCT'
  | 'DELETE_PRODUCT'
  | 'STOCK_ADJUST'
  | 'CREATE_PO'
  | 'CREATE_SO'
  | 'STOCK_TRANSFER'

export interface ApprovalRequest {
  id: string
  actionType: ApprovalActionType
  title: string
  details: string
  requestedBy: string
  requestedRole: 'ADMIN' | 'EMPLOYEE'
  timestamp: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  payload: any
}
