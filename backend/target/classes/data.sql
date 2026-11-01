-- ============================================================
-- SIWMS Initial Seed Data
-- Run this AFTER Hibernate creates the schema (ddl-auto=update)
-- ============================================================

-- Categories
INSERT INTO categories (code, name, description, active) VALUES
('ELEC',   'Electronics',       'Electronic goods and components',           true),
('PHARMA', 'Pharmaceuticals',   'Medicines and healthcare products',          true),
('FMCG',   'FMCG',              'Fast moving consumer goods',                true),
('AUTO',   'Automotive Parts',  'Vehicle parts and accessories',             true),
('INDUS',  'Industrial Tools',  'Heavy-duty industrial tools',               true),
('APRL',   'Apparel',           'Clothing and fashion accessories',          true);

-- Warehouses
INSERT INTO warehouses (code, name, address, city, state, pincode, capacity_sqft, used_capacity_sqft, temperature_type, active) VALUES
('WH-DEL', 'Delhi Central Hub',              'Okhla Industrial Area, Phase II',    'New Delhi',  'Delhi',        '110020', 50000, 38750, 'AMBIENT',    true),
('WH-MUM', 'Mumbai Port Facility',           'Nhava Sheva, JNPT',                  'Mumbai',     'Maharashtra',  '400707', 80000, 61200, 'COLD_CHAIN', true),
('WH-BLR', 'Bangalore Tech Park',           'Whitefield Industrial Zone',          'Bangalore',  'Karnataka',    '560066', 35000, 19600, 'AMBIENT',    true),
('WH-CHN', 'Chennai South Depot',           'Sriperumbudur SEZ',                   'Chennai',    'Tamil Nadu',   '602105', 45000, 40500, 'AMBIENT',    true),
('WH-HYD', 'Hyderabad Distribution Center', 'Patancheru Industrial Area',          'Hyderabad',  'Telangana',    '502319', 30000,  9000, 'MIXED',      true);

-- Default Users (password: Admin@2024, bcrypt encoded)
INSERT INTO users (full_name, email, password, role, active) VALUES
('Arjun Mehta',    'admin@siwms.com',   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',  'ADMIN',               true),
('Priya Sharma',   'priya@siwms.com',   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',  'WAREHOUSE_MANAGER',   true),
('Rajan Patel',    'rajan@siwms.com',   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',  'INVENTORY_STAFF',     true),
('Kavya Reddy',    'kavya@siwms.com',   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',  'PROCUREMENT_OFFICER', true),
('Deepak Singh',   'deepak@siwms.com',  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',  'SALES_EXECUTIVE',     true),
('Meena Joshi',    'meena@siwms.com',   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',  'FINANCE_MANAGER',     true);
