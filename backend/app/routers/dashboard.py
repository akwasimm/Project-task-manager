# app/routers/dashboard.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.database import get_db
from app.models.task import Task
from app.models.project import Project
from app.models.user import User
from app.schemas.dashboard import DashboardStats, StatusCount
from app.schemas.task import TaskResponse
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    is_admin = current_user.role == "admin"

    # ── Projects count ────────────────────
    if is_admin:
        total_projects = db.query(func.count(Project.id)).scalar()
    else:
        total_projects = len(current_user.projects)

    # ── Tasks query base ──────────────────
    if is_admin:
        all_tasks = db.query(Task).all()
        my_tasks  = db.query(Task).filter(
            Task.assigned_to == current_user.id
        ).count()
    else:
        all_tasks = db.query(Task).filter(
            Task.assigned_to == current_user.id
        ).all()
        my_tasks = len(all_tasks)

    total_tasks = len(all_tasks)
    now         = datetime.utcnow()

    # ── Status breakdown ──────────────────
    todo        = sum(1 for t in all_tasks if t.status == "todo")
    in_progress = sum(1 for t in all_tasks if t.status == "in_progress")
    done        = sum(1 for t in all_tasks if t.status == "done")
    overdue     = sum(
        1 for t in all_tasks
        if t.due_date and t.status != "done" and now > t.due_date
    )

    # ── Recent 5 tasks ────────────────────
    recent_query = db.query(Task).order_by(Task.created_at.desc())
    if not is_admin:
        recent_query = recent_query.filter(Task.assigned_to == current_user.id)
    recent_tasks = recent_query.limit(5).all()

    def to_response(task):
        from app.schemas.task import TaskResponse
        data = TaskResponse.model_validate(task)
        if task.due_date and task.status != "done":
            data.is_overdue = now > task.due_date
        return data

    return DashboardStats(
        total_projects   = total_projects,
        total_tasks      = total_tasks,
        my_tasks         = my_tasks,
        status_breakdown = StatusCount(
            todo        = todo,
            in_progress = in_progress,
            done        = done,
            overdue     = overdue,
        ),
        recent_tasks = [to_response(t) for t in recent_tasks],
    )