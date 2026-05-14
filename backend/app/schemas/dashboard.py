# app/schemas/dashboard.py
from pydantic import BaseModel
from typing import List
from app.schemas.task import TaskResponse


class StatusCount(BaseModel):
    todo:        int = 0
    in_progress: int = 0
    done:        int = 0
    overdue:     int = 0


class DashboardStats(BaseModel):
    total_projects:   int
    total_tasks:      int
    my_tasks:         int
    status_breakdown: StatusCount
    recent_tasks:     List[TaskResponse] = []