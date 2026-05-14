# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

print("📦 Importing models...")
from app.models.project import Project, project_members
from app.models.user import User
from app.models.task import Task
print("✅ Models imported")

print("📦 Importing routers...")
from app.routers.auth import router as auth_router
print("✅ auth router imported")
from app.routers.users import router as users_router
print("✅ users router imported")
from app.routers.projects import router as projects_router
print("✅ projects router imported")
from app.routers.tasks import router as tasks_router
print("✅ tasks router imported")
from app.routers.dashboard import router as dashboard_router
print("✅ dashboard router imported")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("📦 Registering routers...")
app.include_router(auth_router)
print("✅ auth registered")
app.include_router(users_router)
print("✅ users registered")
app.include_router(projects_router)
print("✅ projects registered")
app.include_router(tasks_router)
print("✅ tasks registered")
app.include_router(dashboard_router)
print("✅ dashboard registered")

@app.get("/", tags=["Root"])
def root():
    return {"message": "Project Management API is running ✅"}

print("🚀 App ready!")