# Project Manager Backend

FastAPI backend for Project Manager application, ready for Render deployment.

## Environment Variables

The following environment variables must be set in production (Render):

- `DATABASE_URL`: PostgreSQL database URL (legacy, can be same as DATABASE_URL_NEON)
- `DATABASE_URL_NEON`: Neon PostgreSQL database URL (primary database connection)
- `SECRET_KEY`: JWT secret key for authentication
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes (default: 30)
- `ADMIN_SECRET_KEY`: Secret key for admin operations
- `FRONTEND_URL`: Frontend URL for CORS configuration (e.g., https://your-frontend.com)

## Deployment on Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the root directory to `backend`
4. Render will automatically detect the `render.yaml` file
5. Set the environment variables in the Render dashboard
6. Deploy

## Local Development

1. Create a virtual environment:
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in `.env` file (see `.env.example`)

4. Run the application:
```bash
uvicorn app.main:app --reload
```

## Database

The application uses Neon PostgreSQL. The database URL should be set in the `DATABASE_URL_NEON` environment variable.
