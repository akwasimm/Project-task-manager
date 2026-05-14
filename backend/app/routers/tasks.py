# app/routers/tasks.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import uuid

from app.database import get_db
from app.models.task import Task
from app.models.project import Project
from app.models.user import User
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskStatusUpdate,
    TaskResponse,
)
from app.dependencies.auth import get_current_user, require_admin

router = APIRouter(tags=["Tasks"])


# ── helper ────────────────────────────────
def check_overdue(task: Task) -> bool:
    if task.due_date and task.status != "done":
        return datetime.utcnow() > task.due_date
    return False


def task_to_response(task: Task) -> dict:
    data = TaskResponse.model_validate(task)
    data.is_overdue = check_overdue(task)
    return data


# ─────────────────────────────────────────
# POST /projects/{project_id}/tasks  (Admin only)
# ─────────────────────────────────────────
@router.post(
    "/projects/{project_id}/tasks",
    response_model=TaskResponse,
    status_code=201,
)
def create_task(
    project_id: uuid.UUID,
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    # Check project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # If assigning, make sure user exists & is a project member
    if data.assigned_to:
        assignee = db.query(User).filter(User.id == data.assigned_to).first()
        if not assignee:
            raise HTTPException(status_code=404, detail="Assigned user not found")
        if assignee not in project.members:
            raise HTTPException(
                status_code=400,
                detail="Assigned user is not a member of this project",
            )

    task = Task(
        title       = data.title,
        description = data.description,
        status      = data.status,
        priority    = data.priority,
        due_date    = data.due_date,
        project_id  = project_id,
        assigned_to = data.assigned_to,
        created_by  = current_user.id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task_to_response(task)


# ─────────────────────────────────────────
# GET /projects/{project_id}/tasks
# ─────────────────────────────────────────
@router.get("/projects/{project_id}/tasks", response_model=List[TaskResponse])
def get_tasks_by_project(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Member must belong to project
    if current_user.role == "member" and current_user not in project.members:
        raise HTTPException(status_code=403, detail="Access denied")

    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    return [task_to_response(t) for t in tasks]


# ─────────────────────────────────────────
# GET /tasks  → all tasks for current user
# ─────────────────────────────────────────
@router.get("/tasks", response_model=List[TaskResponse])
def get_my_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "admin":
        tasks = db.query(Task).all()
    else:
        tasks = (
            db.query(Task)
            .filter(Task.assigned_to == current_user.id)
            .all()
        )
    return [task_to_response(t) for t in tasks]


# ─────────────────────────────────────────
# GET /tasks/{task_id}
# ─────────────────────────────────────────
@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Member can only view tasks assigned to them
    if current_user.role == "member" and task.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return task_to_response(task)


# ─────────────────────────────────────────
# PUT /tasks/{task_id}  (Admin full update)
# ─────────────────────────────────────────
@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: uuid.UUID,
    data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if data.title       is not None: task.title       = data.title
    if data.description is not None: task.description = data.description
    if data.status      is not None: task.status      = data.status
    if data.priority    is not None: task.priority    = data.priority
    if data.due_date    is not None: task.due_date    = data.due_date

    if data.assigned_to is not None:
        project = db.query(Project).filter(Project.id == task.project_id).first()
        assignee = db.query(User).filter(User.id == data.assigned_to).first()
        if not assignee:
            raise HTTPException(status_code=404, detail="Assigned user not found")
        if assignee not in project.members:
            raise HTTPException(
                status_code=400,
                detail="Assigned user is not a member of this project",
            )
        task.assigned_to = data.assigned_to

    db.commit()
    db.refresh(task)
    return task_to_response(task)


# ─────────────────────────────────────────
# PATCH /tasks/{task_id}/status  (Member - own tasks only)
# ─────────────────────────────────────────
@router.patch("/tasks/{task_id}/status", response_model=TaskResponse)
def update_task_status(
    task_id: uuid.UUID,
    data: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Member can only update their own task status
    if current_user.role == "member" and task.assigned_to != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only update status of your own tasks",
        )

    task.status = data.status
    db.commit()
    db.refresh(task)
    return task_to_response(task)


# ─────────────────────────────────────────
# DELETE /tasks/{task_id}  (Admin only)
# ─────────────────────────────────────────
@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return None