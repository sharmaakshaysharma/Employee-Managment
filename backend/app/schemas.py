from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional
from app.database.models import AttendanceStatus

# Attendance Schemas
class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    employee_id: int

    class Config:
        from_attributes = True

# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    attendances: List[Attendance] = []

    class Config:
        from_attributes = True
