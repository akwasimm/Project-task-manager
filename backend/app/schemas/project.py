# app/schemass/project.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import uuid

# ─────────────────────────────────────────
# Nested user info (used inside project response)
# ─────────────────────────────────────────
class UserBasic(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True

# ─────────────────────────────────────────
# REQUEST schemasS
# ─────────────────────────────────────────
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class AddMemberRequest(BaseModel):
    user_id: uuid.UUID

# ─────────────────────────────────────────
# RESPONSE schemasS
# ─────────────────────────────────────────
class ProjectResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    owner_id: Optional[uuid.UUID]
    created_at: datetime
    owner: Optional[UserBasic]
    members: List[UserBasic] = []

    class Config:
        from_attributes = True