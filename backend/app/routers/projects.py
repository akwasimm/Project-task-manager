# app/routers/projects.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    AddMemberRequest,
)
from app.dependencies.auth import get_current_user, require_admin

router = APIRouter(prefix="/projects", tags=["Projects"])


# ─────────────────────────────────────────
# POST /projects  (Admin only)
# ─────────────────────────────────────────
@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),   # ← Admin only
):
    project = Project(
        name=data.name,
        description=data.description,
        owner_id=current_user.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


# ─────────────────────────────────────────
# GET /projects  (Admin → all, Member → only assigned)
# ─────────────────────────────────────────
@router.get("/", response_model=List[ProjectResponse])
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "admin":
        return db.query(Project).all()
    
    # Member sees only projects they are a member of
    return current_user.projects


# ─────────────────────────────────────────
# GET /projects/{id}
# ─────────────────────────────────────────
@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Member can only view their own projects
    if current_user.role == "member" and current_user not in project.members:
        raise HTTPException(status_code=403, detail="Access denied")

    return project


# ─────────────────────────────────────────
# PUT /projects/{id}  (Admin only)
# ─────────────────────────────────────────
@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: uuid.UUID,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),   # ← Admin only
):
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if data.name is not None:
        project.name = data.name
    if data.description is not None:
        project.description = data.description

    db.commit()
    db.refresh(project)
    return project


# ─────────────────────────────────────────
# DELETE /projects/{id}  (Admin only)
# ─────────────────────────────────────────
@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),   # ← Admin only
):
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return None


# ─────────────────────────────────────────
# POST /projects/{id}/members  (Admin only)
# ─────────────────────────────────────────
@router.post("/{project_id}/members", response_model=ProjectResponse)
def add_member(
    project_id: uuid.UUID,
    data: AddMemberRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),   # ← Admin only
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check already a member
    if user in project.members:
        raise HTTPException(status_code=400, detail="User is already a member")

    project.members.append(user)
    db.commit()
    db.refresh(project)
    return project


# ─────────────────────────────────────────
# DELETE /projects/{id}/members/{user_id}  (Admin only)
# ─────────────────────────────────────────
@router.delete("/{project_id}/members/{user_id}", response_model=ProjectResponse)
def remove_member(
    project_id: uuid.UUID,
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),   # ← Admin only
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user not in project.members:
        raise HTTPException(status_code=400, detail="User is not a member")

    project.members.remove(user)
    db.commit()
    db.refresh(project)
    return project