# SIWMS — Setup Guide

## Frontend (React + Vite)

Already running on port 8443 (Figma Make dev server). View in the preview panel.

```bash
pnpm dev        # development
pnpm build      # production build
```

## Backend (Java 17 + Spring Boot 3.2 + MySQL)

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+

### Database Setup
```sql
CREATE DATABASE siwms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'siwms'@'localhost' IDENTIFIED BY 'StrongPass@2024';
GRANT ALL PRIVILEGES ON siwms_db.* TO 'siwms'@'localhost';
FLUSH PRIVILEGES;
```

### Configure `backend/src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/siwms_db?...
spring.datasource.username=siwms
spring.datasource.password=StrongPass@2024
```

### Run the Backend
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```
Backend starts on: `http://localhost:8080/api`

### API Endpoints

| Module             | Base URL                          |
|--------------------|-----------------------------------|
| Authentication     | POST /api/auth/login              |
| Products           | GET/POST /api/products            |
| Inventory          | GET /api/inventory                |
| Purchase Orders    | GET/POST /api/purchase-orders     |
| Sales Orders       | GET/POST /api/sales-orders        |
| Warehouses         | GET/POST /api/warehouses          |
| Suppliers          | GET/POST /api/suppliers           |
| Reports            | GET /api/reports/*                |

### Demo Credentials
| Role               | Email                  | Password   |
|--------------------|------------------------|------------|
| Administrator      | admin@siwms.com        | Admin@2024 |
| Warehouse Manager  | priya@siwms.com        | Admin@2024 |
| Inventory Staff    | rajan@siwms.com        | Admin@2024 |
| Procurement        | kavya@siwms.com        | Admin@2024 |
| Sales Executive    | deepak@siwms.com       | Admin@2024 |
| Finance Manager    | meena@siwms.com        | Admin@2024 |

## Tech Stack

**Frontend:** React 19 · Vite 8 · Tailwind CSS v4 · React Router v7 · Recharts · Lucide React

**Backend:** Java 17 · Spring Boot 3.2 · Spring Security + JWT · Spring Data JPA · Hibernate · MySQL 8

**Features:** Role-based access control · JWT authentication · Real-time inventory tracking · Multi-warehouse management · Purchase & sales order workflows · Stock transfer management · Automated alert scheduling · PDF & Excel export (iText + Apache POI) · Barcode/QR code support (ZXing) · Email notifications
