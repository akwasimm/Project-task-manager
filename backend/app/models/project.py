# app/models/project.py
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

project_members = Table(
    "project_members",
    Base.metadata,
    Column(
        "project_id",
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE")
    ),
    Column(
        "user_id",
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE")
    ),
)


class Project(Base):
    __tablename__ = "projects"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    owner_id    = Column(
                    UUID(as_uuid=True),
                    ForeignKey("users.id", ondelete="SET NULL"),
                    nullable=True
                  )
    created_at  = Column(DateTime, default=datetime.utcnow)

    # ── Relationships ──────────────────────
    owner   = relationship("User", back_populates="owned_projects")
    members = relationship(
                "User",
                secondary=project_members,
                back_populates="projects"
              )
    tasks   = relationship(      
                "Task",
                back_populates="project",
                cascade="all, delete"
              )