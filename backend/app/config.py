#Environment settings
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_URL_NEON: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ADMIN_SECRET_KEY: str
    FRONTEND_URL: str = "*"

    class Config:
        env_file = ".env"

settings = Settings()