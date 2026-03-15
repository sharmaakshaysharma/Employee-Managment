from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from app.database import models
from app import schemas
from app.routes import crud
from app.database.database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/employees/", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = crud.get_employee_by_emp_id(db, emp_id=employee.employee_id)
    if db_employee:
        raise HTTPException(status_code=400, detail="Employee ID already registered")
    return crud.create_employee(db=db, employee=employee)

@app.get("/employees/", response_model=List[schemas.Employee])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = crud.get_employees(db, skip=skip, limit=limit)
    return employees

@app.get("/employees/{id}", response_model=schemas.Employee)
def read_employee(id: int, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id=id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@app.delete("/employees/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(id: int, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id=id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    crud.delete_employee(db, employee_id=id)
    return None

@app.post("/employees/{id}/attendance/", response_model=schemas.Attendance)
def mark_attendance(id: int, attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id=id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return crud.create_attendance(db=db, attendance=attendance, employee_id=id)

@app.get("/employees/{id}/attendance/", response_model=List[schemas.Attendance])
def get_employee_attendance(id: int, db: Session = Depends(get_db)):
    db_employee = crud.get_employee(db, employee_id=id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return crud.get_attendance_by_employee(db=db, employee_id=id)

@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    from datetime import date, timedelta
    from app.database.models import Attendance, AttendanceStatus, Employee

    today = date.today()
    total_employees = db.query(Employee).count()

    # Count present today
    present_today = db.query(Attendance).filter(
        Attendance.date == today,
        Attendance.status == AttendanceStatus.PRESENT
    ).count()

    # Last 7 days trend
    weekly_data = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        present = db.query(Attendance).filter(
            Attendance.date == day,
            Attendance.status == AttendanceStatus.PRESENT
        ).count()
        absent = db.query(Attendance).filter(
            Attendance.date == day,
            Attendance.status == AttendanceStatus.ABSENT
        ).count()
        weekly_data.append({
            "date": day.strftime("%a"),
            "present": present,
            "absent": absent,
        })

    # Unique departments
    from sqlalchemy import distinct
    dept_count = db.query(distinct(Employee.department)).count()

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "departments": dept_count,
        "weekly_data": weekly_data,
    }

@app.get("/attendance-records/{date_str}")
def get_attendance_records(date_str: str, db: Session = Depends(get_db)):
    from datetime import datetime
    try:
        query_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    records = db.query(models.Attendance).filter(models.Attendance.date == query_date).all()
    # Map to {employee_id: status}
    return {r.employee_id: r.status for r in records}


