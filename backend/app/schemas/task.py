# app/schemas/task.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum
import uuid


class TaskStatus(str, Enum):
    todo        = "todo"
    in_progress = "in_progress"
    done        = "done"


class TaskPriority(str, Enum):
    low    = "low"
    medium = "medium"
    high   = "high"


# Nested basic info
class UserBasic(BaseModel):
    id:   uuid.UUID
    name: str
    email: str

    class Config:
        from_attributes = True


class ProjectBasic(BaseModel):
    id:   uuid.UUID
    name: str

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# REQUEST SCHEMAS
# ─────────────────────────────────────────
class TaskCreate(BaseModel):
    title:       str
    description: Optional[str]  = None
    status:      TaskStatus     = TaskStatus.todo
    priority:    TaskPriority   = TaskPriority.medium
    due_date:    Optional[datetime] = None
    assigned_to: Optional[uuid.UUID] = None


class TaskUpdate(BaseModel):
    title:       Optional[str]      = None
    description: Optional[str]      = None
    status:      Optional[TaskStatus]   = None
    priority:    Optional[TaskPriority] = None
    due_date:    Optional[datetime]     = None
    assigned_to: Optional[uuid.UUID]    = None


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


# ─────────────────────────────────────────
# RESPONSE SCHEMA
# ─────────────────────────────────────────
class TaskResponse(BaseModel):
    id:          uuid.UUID
    title:       str
    description: Optional[str]
    status:      TaskStatus
    priority:    TaskPriority
    due_date:    Optional[datetime]
    project_id:  uuid.UUID
    created_at:  datetime
    is_overdue:  bool = False

    assignee: Optional[UserBasic]  = None
    creator:  Optional[UserBasic]  = None
    project:  Optional[ProjectBasic] = None

    class Config:
        from_attributes = True