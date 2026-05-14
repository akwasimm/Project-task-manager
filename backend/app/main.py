"""
Main FastAPI application file.
Creates API endpoints and configures middleware.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

# Import all models first to ensure SQLAlchemy metadata is populated
from app.models.project import Project, project_members
from app.models.user import User
from app.models.task import Task

# Import routers
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.projects import router as projects_router
from app.routers.tasks import router as tasks_router
from app.routers.dashboard import router as dashboard_router

# Create all database tables 
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Project Management API",
    version="1.0.0",
    description="Enterprise-grade API for project management system"
)

# CORS configuration
# Note: In production, set FRONTEND_URL in environment variables
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://project-task-manager-liart.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(projects_router)
app.include_router(tasks_router)
app.include_router(dashboard_router)

@app.get("/", tags=["Root"])
def root():
    """
    Health check endpoint.
    Returns:
        dict: Status message confirming API is running
    """
    return {"message": "Project Management API is running"}