# Project Manager App

A full-stack project management application built with a FastAPI backend and a React + TypeScript frontend. The system supports authenticated project and task management, role-based access control, project membership, task assignment, dashboards, and admin controls.

## Key Features

- User authentication with JWT-based login and signup
- Role-based access control for `admin` and `member`
- Project creation, editing, and deletion for admin users
- Project membership management for assigning and removing members
- Task creation, assignment, status updates, and priority management
- Overdue task detection and dashboard task summaries
- Admin-only user management endpoints
- Responsive React frontend with route protection and charts

## Architecture

- `backend/` — FastAPI application with SQLAlchemy models, PostgreSQL support, authentication, and REST API routers.
- `frontend/` — React application bootstrapped with Vite and TypeScript, using React Router, React Query, and Axios.

## Tech Stack

- Backend: Python 3.11+, FastAPI, SQLAlchemy, PostgreSQL, Pydantic, Python-JOSE, bcrypt
- Frontend: React, TypeScript, Vite, Axios, React Router, React Hook Form, React Query, Recharts

## Folder Layout

- `backend/`
  - `app/main.py` — FastAPI application entry point
  - `app/routers/` — API endpoints for authentication, users, projects, tasks, dashboard
  - `app/models/` — SQLAlchemy database models
  - `app/schemas/` — request and response validation models
  - `app/utils/` — security utilities for password hashing and JWT
  - `app/database.py` — database engine and session configuration
  - `render.yaml` — deployment configuration for Render
- `frontend/`
  - `src/App.tsx` — application routes and protected navigation
  - `src/pages/` — main app views for dashboard, projects, tasks, users, auth
  - `src/api/axiosInstance.ts` — shared Axios client with auth token interceptor
  - `src/hooks/` — reusable hooks for authentication and data fetching
  - `src/components/` — UI components, modals, cards, status badges, and form controls

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+
- PostgreSQL-compatible database (Neon, PostgreSQL, or other hosted provider)

### Backend Setup

1. Open a terminal in `backend/`
2. Create and activate a virtual environment:

```powershell
python -m venv .venv
.venv\Scripts\activate
```

3. Install dependencies:

```powershell
pip install -r requirements.txt
```

4. Provide required environment variables in a `.env` file at `backend/.env`:

```env
DATABASE_URL_NEON=<your-postgres-url>
SECRET_KEY=<your-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_SECRET_KEY=<your-admin-secret>
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:

```powershell
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

> Note: the backend currently registers a fixed CORS origin for production deployment. If you run the frontend locally, verify or adjust CORS settings in `backend/app/main.py`.

### Frontend Setup

1. Open a terminal in `frontend/`
2. Install dependencies:

```powershell
npm install
```

3. Configure the frontend API endpoint by adding a `.env` file at `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

4. Start the frontend development server:

```powershell
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Application Workflow

- Users sign up and log in through the frontend.
- Admin users can manage projects, assign project members, and create tasks.
- Members can view assigned projects and update task status for tasks assigned to them.
- The dashboard provides a summary of project counts, task counts, overdue tasks, and a recent activity feed.

## API Overview

### Authentication
- `POST /auth/signup` — create a new user; `admin` role requires `ADMIN_SECRET_KEY`
- `POST /auth/login` — authenticate and receive a JWT access token
- `GET /auth/me` — get current authenticated user profile

### Projects
- `GET /projects` — list projects (admin sees all; members see their projects)
- `POST /projects` — create a project (admin only)
- `GET /projects/{id}` — fetch project details
- `PUT /projects/{id}` — update a project (admin only)
- `DELETE /projects/{id}` — delete a project (admin only)
- `POST /projects/{id}/members` — add a project member (admin only)
- `DELETE /projects/{id}/members/{user_id}` — remove a project member (admin only)

### Tasks
- `POST /projects/{project_id}/tasks` — create a task in a project (admin only)
- `GET /projects/{project_id}/tasks` — list project tasks
- `GET /tasks` — list tasks for current user
- `GET /tasks/{task_id}` — task detail
- `PUT /tasks/{task_id}` — update task (admin only)
- `PATCH /tasks/{task_id}/status` — update task status
- `DELETE /tasks/{task_id}` — delete task (admin only)

### Dashboard
- `GET /dashboard/stats` — aggregated project and task metrics plus recent tasks

### Users
- `GET /users` — list users (admin only)
- `GET /users/{id}` — view a user (admin only)
- `DELETE /users/{id}` — delete a user (admin only)

## Deployment Notes

- `backend/render.yaml` is included for Render deployment.
- Backend deployment should configure environment variables through the hosting provider.
- Frontend can be deployed separately on Vercel, Netlify, or any static host.

## Notes

- Passwords are hashed with bcrypt.
- JWT sessions are issued with configurable expiration.
- Admin and member roles are enforced by backend dependencies.
- The frontend stores tokens in `localStorage` and attaches them automatically to API requests.

## Contact

For questions or enhancements, review the source code in `backend/app` and `frontend/src` for implementation details.
