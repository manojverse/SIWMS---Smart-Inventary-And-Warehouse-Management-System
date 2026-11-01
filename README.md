# 📦 Smart Inventory and Warehouse Management System (SIWMS)

A web-based inventory and warehouse management application designed to simplify stock monitoring, inventory operations, warehouse management, and business insights through a centralized dashboard.

## 📌 Project Overview

The **Smart Inventory and Warehouse Management System (SIWMS)** is a full-stack-oriented project developed to help businesses manage inventory-related activities efficiently.

The application provides an interface for monitoring stock levels, managing inventory records, viewing warehouse information, and accessing inventory-related insights.

It aims to reduce manual inventory management efforts, improve stock visibility, and support better inventory decisions.

## 🎯 Objectives

- Simplify inventory and stock management.
- Provide centralized inventory visibility.
- Organize warehouse-related information.
- Monitor stock levels and inventory movements.
- Display inventory insights through dashboards and charts.
- Provide convenient data export and reporting options.

## ✨ Key Features

### 1. Dashboard
- Centralized inventory overview.
- Inventory statistics and summary cards.
- Graphical representation of inventory information.
- Quick access to important sections.

### 2. Inventory Management
- View and manage inventory records.
- Search and filter inventory items.
- Monitor SKU and stock information.
- Maintain inventory-related details.

### 3. Warehouse Management
- View warehouse information.
- Organize warehouse-related records.
- Monitor warehouse network information.

### 4. Inventory Analytics
- Visual representation of inventory information.
- Charts and analytical summaries.
- Inventory-related data insights.

### 5. Barcode and QR Code
- SKU-based text lookup.
- Generate barcode and QR code labels.
- Support product identification through generated labels.

### 6. AI Copilot
- Rule-based keyword matching.
- Provides predefined inventory-related assistance.
- Helps users access relevant information through simple queries.

### 7. Data Export
- Export supported information in CSV and JSON formats.
- Printable HTML reports.
- Convenient access to inventory information.

### 8. User Interface
- Responsive web interface.
- Navigation between application modules.
- Dashboard-oriented design.
- Interactive charts and visual components.

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | User interface development |
| TypeScript | Type-safe development |
| Vite 8 | Development server and build tool |
| Tailwind CSS v4 | UI styling |
| React Router v7 | Application navigation |
| Recharts | Data visualization |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|---|---|
| Java 17 | Backend programming |
| Spring Boot 3.2.0 | Backend application framework |
| Spring Security | Security framework |
| Spring Data JPA | Database operations |
| Hibernate | ORM |
| JWT | Token-based authentication |
| H2 Database | Development database |
| MySQL Driver | MySQL connectivity support |

## 🏗️ Project Architecture

The project contains separate frontend and backend implementations.

**Frontend:** React and TypeScript application that currently uses mock data and browser localStorage for its application data.

**Backend:** Independent Spring Boot REST API application with security and database-related components.

**Important:** Frontend and backend integration is not yet completed. The frontend currently does not communicate with the Spring Boot backend.

## 📂 Project Structure

```text
SIWMS/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
│
├── .gitignore
└── README.md
```

*Note: This is a representative structure. Folder names may vary depending on the actual project files.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Java Development Kit (JDK) 17
- Maven
- Visual Studio Code or IntelliJ IDEA
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/manojverse/SIWMS---Smart-Inventory-And-Warehouse-Management-System.git
```

### 2. Navigate to the Project

```bash
cd SIWMS---Smart-Inventory-And-Warehouse-Management-System
```

### 3. Run the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 4. Run the Backend

Open another terminal and navigate to the backend directory:

```bash
cd backend
```

Build the Spring Boot application:

```bash
mvn clean install
```

Run the application:

```bash
mvn spring-boot:run
```

The backend will start using the configured Spring Boot application settings.

*Note: Configure the database and application properties according to your local environment before running the backend.*

## 🖥️ Application Screenshots

Add your actual application screenshots in the `screenshots` folder and update the image paths below.

### Login Page

![Login Page](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Inventory Ledger

![Inventory Ledger](screenshots/inventory-ledger.png)

### Warehouse Network

![Warehouse Network](screenshots/warehouse-network.png)

## 🔮 Future Enhancements

- Complete frontend and backend integration.
- Connect the application to a production database.
- Implement real-time inventory synchronization.
- Add camera-based barcode scanning.
- Develop advanced inventory analytics.
- Integrate an actual AI-powered assistant.
- Implement automated inventory alerts.
- Expand reporting and export capabilities.
- Add comprehensive automated testing.

## ⚠️ Current Implementation Notes

- Frontend application data currently uses mock data and browser localStorage.
- Spring Boot backend is maintained separately and is not integrated with the frontend.
- AI Copilot currently uses rule-based keyword matching rather than an external AI model.
- Barcode functionality supports SKU text lookup and barcode/QR label generation; camera-based scanning is not implemented.
- CSV/JSON export and printable HTML reports are handled on the client side.
- Automated test coverage is not yet implemented.

## 🎓 Project Information

| Detail | Information |
|---|---|
| Project Title | Smart Inventory and Warehouse Management System |
| Abbreviation | SIWMS |
| Domain | Web Development |
| Frontend | React + TypeScript |
| Backend | Java + Spring Boot |
| Database Technologies | H2 / MySQL Driver |
| Project Type | Academic / Internship Project |

## 👨‍💻 Developer

**Manoj S**

Computer Science and Engineering

GitHub: [@manojverse](https://github.com/manojverse)

## 📜 License

This project is developed for academic and learning purposes.

---

⭐ If you find this project interesting, consider giving the repository a star!
