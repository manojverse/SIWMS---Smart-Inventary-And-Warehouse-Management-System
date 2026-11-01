import type {
  User, Category, Warehouse, Supplier, Product,
  InventoryItem, PurchaseOrder, SalesOrder, Alert, StockTransfer
} from '../types'

export const currentUser: User = {
  id: 1, name: 'Arjun Mehta', email: 'admin@siwms.com',
  role: 'ADMIN', status: 'Active', lastLogin: '2024-07-30 09:12', avatar: 'AM',
}

export const users: User[] = [
  { id: 1, name: 'Arjun Mehta', email: 'arjun@siwms.com', role: 'ADMIN', status: 'Active', lastLogin: '2024-07-30 09:12', avatar: 'AM' },
  { id: 2, name: 'Priya Sharma', email: 'priya@siwms.com', role: 'WAREHOUSE_MANAGER', warehouse: 'WH-Delhi', status: 'Active', lastLogin: '2024-07-30 08:45', avatar: 'PS' },
  { id: 3, name: 'Rajan Patel', email: 'rajan@siwms.com', role: 'INVENTORY_STAFF', warehouse: 'WH-Mumbai', status: 'Active', lastLogin: '2024-07-29 17:30', avatar: 'RP' },
  { id: 4, name: 'Kavya Reddy', email: 'kavya@siwms.com', role: 'PROCUREMENT_OFFICER', status: 'Active', lastLogin: '2024-07-30 10:05', avatar: 'KR' },
  { id: 5, name: 'Deepak Singh', email: 'deepak@siwms.com', role: 'SALES_EXECUTIVE', status: 'Active', lastLogin: '2024-07-30 07:55', avatar: 'DS' },
  { id: 6, name: 'Meena Joshi', email: 'meena@siwms.com', role: 'FINANCE_MANAGER', status: 'Inactive', lastLogin: '2024-07-25 14:20', avatar: 'MJ' },
  { id: 7, name: 'Suresh Kumar', email: 'suresh@siwms.com', role: 'INVENTORY_STAFF', warehouse: 'WH-Chennai', status: 'Active', lastLogin: '2024-07-30 06:30', avatar: 'SK' },
]

export const categories: Category[] = [
  { id: 1, name: 'Electronics', code: 'ELEC', description: 'Electronic goods and components', productCount: 142 },
  { id: 2, name: 'Pharmaceuticals', code: 'PHARMA', description: 'Medicines and healthcare products', productCount: 87 },
  { id: 3, name: 'FMCG', code: 'FMCG', description: 'Fast moving consumer goods', productCount: 215 },
  { id: 4, name: 'Automotive Parts', code: 'AUTO', description: 'Vehicle parts and accessories', productCount: 63 },
  { id: 5, name: 'Industrial Tools', code: 'INDUS', description: 'Heavy-duty industrial tools', productCount: 44 },
  { id: 6, name: 'Apparel', code: 'APRL', description: 'Clothing and fashion accessories', productCount: 189 },
]

export const warehouses: Warehouse[] = [
  { id: 1, code: 'WH-DEL', name: 'Delhi Central Hub', location: 'Okhla Industrial Area, Phase II', city: 'New Delhi', capacity: 50000, used: 38750, manager: 'Priya Sharma', status: 'Active', temperature: 'Ambient' },
  { id: 2, code: 'WH-MUM', name: 'Mumbai Port Facility', location: 'Nhava Sheva, JNPT', city: 'Mumbai', capacity: 80000, used: 61200, manager: 'Vikram Desai', status: 'Active', temperature: 'Cold Chain' },
  { id: 3, code: 'WH-BLR', name: 'Bangalore Tech Park', location: 'Whitefield Industrial Zone', city: 'Bangalore', capacity: 35000, used: 19600, manager: 'Anita Rao', status: 'Active', temperature: 'Ambient' },
  { id: 4, code: 'WH-CHN', name: 'Chennai South Depot', location: 'Sriperumbudur SEZ', city: 'Chennai', capacity: 45000, used: 40500, manager: 'Suresh Kumar', status: 'Active', temperature: 'Ambient' },
  { id: 5, code: 'WH-HYD', name: 'Hyderabad Distribution Center', location: 'Patancheru Industrial Area', city: 'Hyderabad', capacity: 30000, used: 9000, manager: 'Ramesh Gupta', status: 'Active', temperature: 'Mixed' },
]

export const suppliers: Supplier[] = [
  { id: 1, code: 'SUP-001', name: 'Reliance Supply Chain Ltd', contact: 'Anil Kumar', email: 'anil@reliance.com', phone: '+91 98765 43210', city: 'Mumbai', country: 'India', rating: 4.8, totalOrders: 342, onTimeDelivery: 96, status: 'Active', balance: 284000 },
  { id: 2, code: 'SUP-002', name: 'TechSource Global Pvt Ltd', contact: 'Sarah Chen', email: 'sarah@techsource.com', phone: '+91 87654 32109', city: 'Shenzhen', country: 'China', rating: 4.5, totalOrders: 218, onTimeDelivery: 91, status: 'Active', balance: 156000 },
  { id: 3, code: 'SUP-003', name: 'Pharma Distributors India', contact: 'Dr. Rajeev Nair', email: 'rajeev@pharmadist.com', phone: '+91 76543 21098', city: 'Hyderabad', country: 'India', rating: 4.9, totalOrders: 186, onTimeDelivery: 98, status: 'Active', balance: 94500 },
  { id: 4, code: 'SUP-004', name: 'AutoParts Express', contact: 'James Wilson', email: 'james@autoparts.com', phone: '+91 65432 10987', city: 'Pune', country: 'India', rating: 3.8, totalOrders: 97, onTimeDelivery: 82, status: 'Active', balance: 47200 },
  { id: 5, code: 'SUP-005', name: 'FastFast FMCG Solutions', contact: 'Pooja Kapoor', email: 'pooja@fastfmcg.com', phone: '+91 54321 09876', city: 'Delhi', country: 'India', rating: 4.2, totalOrders: 428, onTimeDelivery: 88, status: 'Active', balance: 312600 },
  { id: 6, code: 'SUP-006', name: 'Global Apparel Hub', contact: 'Liu Wei', email: 'liuwei@globalapparel.com', phone: '+91 43210 98765', city: 'Guangzhou', country: 'China', rating: 4.0, totalOrders: 157, onTimeDelivery: 85, status: 'Inactive', balance: 28900 },
]

export const products: Product[] = [
  { id: 1, sku: 'ELEC-001', barcode: '8901234567890', name: 'Samsung Galaxy Tab A9', category: 'Electronics', supplier: 'TechSource Global', unit: 'Piece', costPrice: 18500, sellingPrice: 24999, reorderLevel: 50, maxStock: 500, status: 'Active', expiryTracked: false },
  { id: 2, sku: 'ELEC-002', barcode: '8901234567891', name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', supplier: 'TechSource Global', unit: 'Piece', costPrice: 22000, sellingPrice: 29990, reorderLevel: 30, maxStock: 200, status: 'Active', expiryTracked: false },
  { id: 3, sku: 'PHARMA-001', barcode: '8901234567892', name: 'Paracetamol 500mg Tabs (10x10)', category: 'Pharmaceuticals', supplier: 'Pharma Distributors India', unit: 'Strip', costPrice: 18, sellingPrice: 28, reorderLevel: 2000, maxStock: 50000, status: 'Active', expiryTracked: true },
  { id: 4, sku: 'PHARMA-002', barcode: '8901234567893', name: 'Vitamin D3 Softgels (60)', category: 'Pharmaceuticals', supplier: 'Pharma Distributors India', unit: 'Bottle', costPrice: 180, sellingPrice: 290, reorderLevel: 500, maxStock: 10000, status: 'Active', expiryTracked: true },
  { id: 5, sku: 'FMCG-001', barcode: '8901234567894', name: 'Surf Excel Matic 3kg', category: 'FMCG', supplier: 'FastFast FMCG Solutions', unit: 'Pack', costPrice: 280, sellingPrice: 350, reorderLevel: 1000, maxStock: 20000, status: 'Active', expiryTracked: false },
  { id: 6, sku: 'FMCG-002', barcode: '8901234567895', name: 'Lay\'s Classic Salted 52g', category: 'FMCG', supplier: 'FastFast FMCG Solutions', unit: 'Pack', costPrice: 20, sellingPrice: 30, reorderLevel: 5000, maxStock: 100000, status: 'Active', expiryTracked: true },
  { id: 7, sku: 'AUTO-001', barcode: '8901234567896', name: 'Bosch Spark Plug (Set of 4)', category: 'Automotive Parts', supplier: 'AutoParts Express', unit: 'Set', costPrice: 850, sellingPrice: 1200, reorderLevel: 200, maxStock: 3000, status: 'Active', expiryTracked: false },
  { id: 8, sku: 'APRL-001', barcode: '8901234567897', name: 'Allen Solly Men\'s Polo T-Shirt', category: 'Apparel', supplier: 'Global Apparel Hub', unit: 'Piece', costPrice: 350, sellingPrice: 799, reorderLevel: 100, maxStock: 5000, status: 'Active', expiryTracked: false },
]

export const inventory: InventoryItem[] = [
  { id: 1, product: 'Samsung Galaxy Tab A9', sku: 'ELEC-001', warehouse: 'Delhi Central Hub', quantity: 180, reserved: 35, available: 145, reorderLevel: 50, maxStock: 500, unit: 'Piece', lastUpdated: '2024-07-30 08:30', status: 'In Stock', value: 4500000 },
  { id: 2, product: 'Sony WH-1000XM5', sku: 'ELEC-002', warehouse: 'Mumbai Port Facility', quantity: 42, reserved: 12, available: 30, reorderLevel: 30, maxStock: 200, unit: 'Piece', lastUpdated: '2024-07-30 07:15', status: 'Low Stock', value: 1260000 },
  { id: 3, product: 'Paracetamol 500mg', sku: 'PHARMA-001', warehouse: 'Hyderabad Distribution', quantity: 0, reserved: 0, available: 0, reorderLevel: 2000, maxStock: 50000, unit: 'Strip', lastUpdated: '2024-07-29 16:00', status: 'Out of Stock', batchNo: 'B2024-07', expiryDate: '2026-06-30', value: 0 },
  { id: 4, product: 'Vitamin D3 Softgels', sku: 'PHARMA-002', warehouse: 'Hyderabad Distribution', quantity: 8400, reserved: 600, available: 7800, reorderLevel: 500, maxStock: 10000, unit: 'Bottle', lastUpdated: '2024-07-30 09:00', status: 'In Stock', batchNo: 'B2024-06', expiryDate: '2025-12-31', value: 2268000 },
  { id: 5, product: 'Surf Excel Matic 3kg', sku: 'FMCG-001', warehouse: 'Delhi Central Hub', quantity: 18500, reserved: 2000, available: 16500, reorderLevel: 1000, maxStock: 20000, unit: 'Pack', lastUpdated: '2024-07-30 06:45', status: 'Overstock', value: 6475000 },
  { id: 6, product: "Lay's Classic Salted", sku: 'FMCG-002', warehouse: 'Bangalore Tech Park', quantity: 4200, reserved: 500, available: 3700, reorderLevel: 5000, maxStock: 100000, unit: 'Pack', lastUpdated: '2024-07-29 14:30', status: 'Low Stock', batchNo: 'MFG240715', expiryDate: '2024-10-14', value: 126000 },
  { id: 7, product: 'Bosch Spark Plug Set', sku: 'AUTO-001', warehouse: 'Mumbai Port Facility', quantity: 620, reserved: 80, available: 540, reorderLevel: 200, maxStock: 3000, unit: 'Set', lastUpdated: '2024-07-30 10:00', status: 'In Stock', value: 744000 },
  { id: 8, product: 'Allen Solly Polo T-Shirt', sku: 'APRL-001', warehouse: 'Chennai South Depot', quantity: 2800, reserved: 320, available: 2480, reorderLevel: 100, maxStock: 5000, unit: 'Piece', lastUpdated: '2024-07-28 11:30', status: 'In Stock', value: 2240000 },
]

export const purchaseOrders: PurchaseOrder[] = [
  { id: 1, poNumber: 'PO-2024-0842', supplier: 'TechSource Global Pvt Ltd', warehouse: 'Delhi Central Hub', status: 'Received', orderDate: '2024-07-10', expectedDate: '2024-07-20', receivedDate: '2024-07-19', items: 5, totalAmount: 1850000, paidAmount: 1850000, createdBy: 'Kavya Reddy' },
  { id: 2, poNumber: 'PO-2024-0843', supplier: 'FastFast FMCG Solutions', warehouse: 'Delhi Central Hub', status: 'Ordered', orderDate: '2024-07-25', expectedDate: '2024-08-02', items: 12, totalAmount: 480000, paidAmount: 240000, createdBy: 'Kavya Reddy' },
  { id: 3, poNumber: 'PO-2024-0844', supplier: 'Pharma Distributors India', warehouse: 'Hyderabad Distribution Center', status: 'Approved', orderDate: '2024-07-28', expectedDate: '2024-08-05', items: 8, totalAmount: 320000, paidAmount: 0, createdBy: 'Kavya Reddy' },
  { id: 4, poNumber: 'PO-2024-0845', supplier: 'AutoParts Express', warehouse: 'Mumbai Port Facility', status: 'Pending', orderDate: '2024-07-30', expectedDate: '2024-08-10', items: 3, totalAmount: 127500, paidAmount: 0, createdBy: 'Kavya Reddy' },
  { id: 5, poNumber: 'PO-2024-0841', supplier: 'Global Apparel Hub', warehouse: 'Chennai South Depot', status: 'Received', orderDate: '2024-07-05', expectedDate: '2024-07-15', receivedDate: '2024-07-16', items: 20, totalAmount: 840000, paidAmount: 840000, createdBy: 'Arjun Mehta' },
  { id: 6, poNumber: 'PO-2024-0840', supplier: 'Reliance Supply Chain Ltd', warehouse: 'Bangalore Tech Park', status: 'Cancelled', orderDate: '2024-07-01', expectedDate: '2024-07-12', items: 6, totalAmount: 290000, paidAmount: 0, createdBy: 'Kavya Reddy' },
]

export const salesOrders: SalesOrder[] = [
  { id: 1, soNumber: 'SO-2024-1521', customer: 'Flipkart India Pvt Ltd', warehouse: 'Delhi Central Hub', status: 'Delivered', orderDate: '2024-07-25', shipDate: '2024-07-26', deliveredDate: '2024-07-28', items: 8, subtotal: 224910, tax: 40484, total: 265394, salesRep: 'Deepak Singh', paymentStatus: 'Paid' },
  { id: 2, soNumber: 'SO-2024-1522', customer: 'Amazon Seller Services', warehouse: 'Mumbai Port Facility', status: 'Shipped', orderDate: '2024-07-28', shipDate: '2024-07-29', items: 15, subtotal: 587400, tax: 105732, total: 693132, salesRep: 'Deepak Singh', paymentStatus: 'Paid' },
  { id: 3, soNumber: 'SO-2024-1523', customer: 'Wellness Forever Pharmacy', warehouse: 'Hyderabad Distribution Center', status: 'Picking', orderDate: '2024-07-30', items: 22, subtotal: 94500, tax: 17010, total: 111510, salesRep: 'Deepak Singh', paymentStatus: 'Unpaid' },
  { id: 4, soNumber: 'SO-2024-1524', customer: 'Metro Cash & Carry', warehouse: 'Bangalore Tech Park', status: 'Confirmed', orderDate: '2024-07-30', items: 6, subtotal: 182000, tax: 32760, total: 214760, salesRep: 'Deepak Singh', paymentStatus: 'Partial' },
  { id: 5, soNumber: 'SO-2024-1520', customer: 'Myntra Designs Pvt Ltd', warehouse: 'Chennai South Depot', status: 'Delivered', orderDate: '2024-07-22', shipDate: '2024-07-23', deliveredDate: '2024-07-25', items: 40, subtotal: 319600, tax: 57528, total: 377128, salesRep: 'Deepak Singh', paymentStatus: 'Paid' },
  { id: 6, soNumber: 'SO-2024-1519', customer: 'Croma Electronics', warehouse: 'Delhi Central Hub', status: 'Returned', orderDate: '2024-07-18', shipDate: '2024-07-19', items: 4, subtotal: 99996, tax: 17999, total: 117995, salesRep: 'Deepak Singh', paymentStatus: 'Unpaid' },
]

export const alerts: Alert[] = [
  { id: 1, type: 'out_of_stock' as any, severity: 'critical', product: 'Paracetamol 500mg', warehouse: 'Hyderabad Distribution Center', message: 'Paracetamol 500mg is OUT OF STOCK in Hyderabad. Active orders pending.', timestamp: '2024-07-30 06:15', acknowledged: false },
  { id: 2, type: 'low_stock', severity: 'warning', product: 'Sony WH-1000XM5 Headphones', warehouse: 'Mumbai Port Facility', message: 'Stock at 42 units — below reorder level of 30. Purchase order recommended.', timestamp: '2024-07-30 07:45', acknowledged: false },
  { id: 3, type: 'expiry', severity: 'warning', product: "Lay's Classic Salted 52g", warehouse: 'Bangalore Tech Park', message: 'Batch MFG240715 expires on Oct 14, 2024. 4,200 units at risk.', timestamp: '2024-07-30 08:00', acknowledged: false },
  { id: 4, type: 'low_stock', severity: 'warning', product: "Lay's Classic Salted 52g", warehouse: 'Bangalore Tech Park', message: "Stock at 4,200 — below reorder level of 5,000.", timestamp: '2024-07-30 08:01', acknowledged: false },
  { id: 5, type: 'overstock', severity: 'info', product: 'Surf Excel Matic 3kg', warehouse: 'Delhi Central Hub', message: 'Stock at 18,500 exceeds max limit of 20,000. Consider redistribution.', timestamp: '2024-07-29 17:00', acknowledged: true },
  { id: 6, type: 'pending_po', severity: 'info', message: 'PO-2024-0845 for AutoParts Express awaiting approval.', timestamp: '2024-07-30 09:30', acknowledged: false },
  { id: 7, type: 'expiry', severity: 'critical', product: 'Vitamin D3 Softgels (60)', warehouse: 'Hyderabad Distribution Center', message: 'Batch B2024-06 expires Dec 31, 2025. 8,400 units. Plan clearance.', timestamp: '2024-07-30 05:00', acknowledged: true },
]

export const transfers: StockTransfer[] = [
  { id: 1, transferNo: 'TRF-2024-0128', fromWarehouse: 'Delhi Central Hub', toWarehouse: 'Hyderabad Distribution Center', product: 'Surf Excel Matic 3kg', quantity: 3000, status: 'Approved', requestedBy: 'Priya Sharma', approvedBy: 'Arjun Mehta', requestDate: '2024-07-30', },
  { id: 2, transferNo: 'TRF-2024-0127', fromWarehouse: 'Mumbai Port Facility', toWarehouse: 'Bangalore Tech Park', product: "Lay's Classic Salted 52g", quantity: 10000, status: 'In Transit', requestedBy: 'Vikram Desai', approvedBy: 'Priya Sharma', requestDate: '2024-07-28', },
  { id: 3, transferNo: 'TRF-2024-0126', fromWarehouse: 'Chennai South Depot', toWarehouse: 'Hyderabad Distribution Center', product: 'Paracetamol 500mg', quantity: 5000, status: 'Received', requestedBy: 'Suresh Kumar', approvedBy: 'Arjun Mehta', requestDate: '2024-07-25', completedDate: '2024-07-27' },
]

export const dashboardStats = {
  totalProducts: 740,
  totalInventoryValue: 18412000,
  activeWarehouses: 5,
  pendingAlerts: 4,
  monthlyRevenue: 1667409,
  monthlyPurchases: 2777500,
  lowStockItems: 18,
  pendingOrders: 3,
}

export const stockMovementData = [
  { month: 'Feb', received: 420, dispatched: 380, transferred: 95 },
  { month: 'Mar', received: 510, dispatched: 465, transferred: 110 },
  { month: 'Apr', received: 385, dispatched: 340, transferred: 78 },
  { month: 'May', received: 640, dispatched: 580, transferred: 140 },
  { month: 'Jun', received: 590, dispatched: 520, transferred: 125 },
  { month: 'Jul', received: 728, dispatched: 644, transferred: 162 },
]

export const warehouseUtilizationData = [
  { name: 'Delhi', used: 77.5, free: 22.5 },
  { name: 'Mumbai', used: 76.5, free: 23.5 },
  { name: 'Bangalore', used: 56, free: 44 },
  { name: 'Chennai', used: 90, free: 10 },
  { name: 'Hyderabad', used: 30, free: 70 },
]

export const categoryValueData = [
  { name: 'Electronics', value: 5760000, fill: '#38bdf8' },
  { name: 'Pharmaceuticals', value: 2362500, fill: '#a78bfa' },
  { name: 'FMCG', value: 6601000, fill: '#10b981' },
  { name: 'Automotive', value: 744000, fill: '#f59e0b' },
  { name: 'Apparel', value: 2240000, fill: '#f43f5e' },
  { name: 'Industrial', value: 704500, fill: '#22d3ee' },
]

export const revenueData = [
  { month: 'Feb', revenue: 1240000, purchases: 980000 },
  { month: 'Mar', revenue: 1480000, purchases: 1120000 },
  { month: 'Apr', revenue: 1190000, purchases: 890000 },
  { month: 'May', revenue: 1720000, purchases: 1340000 },
  { month: 'Jun', revenue: 1560000, purchases: 1180000 },
  { month: 'Jul', revenue: 1667409, purchases: 2777500 },
]
