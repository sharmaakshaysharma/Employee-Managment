# HRMS Lite — Full-Stack Coding Assignment

A lightweight Human Resource Management System (HRMS) designed to manage employee records and track daily attendance. Built with a focus on clean architecture, professional UI, and stable full-stack integration.

## 🚀 Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.13+)
- **Database**: SQLite with SQLAlchemy ORM
- **Validation**: Pydantic v2
- **Features**: RESTful API, CORS enabled, duplicate ID prevention, attendance upserts.

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Charts**: Recharts
- **State/API**: Axios for backend communication.

---

## 🛠️ Installation & Setup

### 1. Backend Setup
```powershell
cd backend
# Create virtual environment
python -m venv venv
# Activate (Windows)
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Configure database
# Create a .env file with: DATABASE_URL=postgresql://user:pass@host:port/db
# Run the server
python run.py
```
*Backend runs at: `http://127.0.0.1:8000`*


### 2. Frontend Setup
```powershell
cd frontend
# Install dependencies
npm install
# Run dev server
npm run dev
```
*Frontend runs at: `http://localhost:5173` (or check console for port)*

---

## ✨ Features

- **Employee Management**: 
  - Add employees with unique ID, Email, and Department.
  - View a searchable directory of all staff.
  - Delete employees (cascades to their records).
- **Attendance Tracking**:
  - Mark daily attendance (Present/Absent).
  - Persistence: Attendance data stays synced even after refresh or date change.
- **Dashboard**:
  - Live stats for Total Employees and Present Today.
  - Weekly attendance visualization using Bar Charts.
  - Real-time attendance rate tracking.

---

## 📡 API Endpoints Summary

- `GET  /employees/` - List all employees
- `POST /employees/` - Create a new employee
- `GET  /dashboard/stats` - Fetch aggregate stats for the dashboard
- `GET  /attendance-records/{date}` - Get all records for a specific date
- `POST /employees/{id}/attendance/` - Mark attendance for an employee
