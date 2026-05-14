# app/models/task.py--
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title       = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status      = Column(
                    Enum("todo", "in_progress", "done", name="task_status"),
                    default="todo",
                    nullable=False
                  )
    priority    = Column(
                    Enum("low", "medium", "high", name="task_priority"),
                    default="medium",
                    nullable=False
                  )
    due_date    = Column(DateTime, nullable=True)
    project_id  = Column(
                    UUID(as_uuid=True),
                    ForeignKey("projects.id", ondelete="CASCADE"),
                    nullable=False
                  )
    assigned_to = Column(
                    UUID(as_uuid=True),
                    ForeignKey("users.id", ondelete="SET NULL"),
                    nullable=True
                  )
    created_by  = Column(
                    UUID(as_uuid=True),
                    ForeignKey("users.id", ondelete="SET NULL"),
                    nullable=True
                  )
    created_at  = Column(DateTime, default=datetime.utcnow)

    project  = relationship("Project", back_populates="tasks")
    assignee = relationship(
                    "User",
                    back_populates="assigned_tasks",
                    foreign_keys=[assigned_to]
               )
    creator  = relationship(
                    "User",
                    back_populates="created_tasks",
                    foreign_keys=[created_by]
               )