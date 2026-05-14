# app/utils/security.py
from datetime import datetime, timedelta
import bcrypt
from jose import JWTError, jwt
from app.config import settings


# ── Password Hashing (using raw bcrypt) ──────────────────
def hash_password(password: str) -> str:
    # Prevent bcrypt 72-byte crash
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password cannot exceed 72 bytes")

    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(pwd_bytes, salt)

    return hashed_bytes.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Prevent bcrypt crash during verify
    if len(plain_password.encode("utf-8")) > 72:
        return False

    plain_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")

    return bcrypt.checkpw(plain_bytes, hashed_bytes)


# ── JWT Token ──────────────────────────────────────────
def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def verify_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        return payload

    except JWTError:
        return None