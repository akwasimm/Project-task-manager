# app/models/user.py
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.project import project_members


class User(Base):
    __tablename__ = "users"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name       = Column(String(100), nullable=False)
    email      = Column(String(100), unique=True, nullable=False, index=True)
    password   = Column(String(255), nullable=False)
    role       = Column(
                   Enum("admin", "member", name="user_role"),
                   default="member"
                 )
    created_at = Column(DateTime, default=datetime.utcnow)

    # ── Relationships ──────────────────────
    owned_projects = relationship("Project", back_populates="owner")
    projects       = relationship(
                        "Project",
                        secondary=project_members,
                        back_populates="members"
                     )
    assigned_tasks = relationship(      
                        "Task",
                        back_populates="assignee",
                        foreign_keys="Task.assigned_to"
                     )
    created_tasks  = relationship(       
                        "Task",
                        back_populates="creator",
                        foreign_keys="Task.created_by"
                     )