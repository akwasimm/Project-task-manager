# app/schemass/user.py
from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import datetime
import uuid

class UserRole(str, Enum):
    admin = "admin"
    member = "member"

# ---------- REQUEST schemasS ----------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.member

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ---------- RESPONSE schemasS ----------
class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2

# ---------- TOKEN schemasS ----------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: str | None = None