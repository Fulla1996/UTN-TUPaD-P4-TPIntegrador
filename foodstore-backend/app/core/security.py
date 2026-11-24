import os
from datetime import UTC, datetime, timedelta
from typing import Annotated

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import Cookie, Depends, HTTPException, status

from app.modules.usuarios.model import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("No se configuró SECRET_KEY en el archivo .env")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def verificar_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(
        password.encode("utf-8"),
        password_hash.encode("utf-8"),
    )


def crear_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def get_current_user(
    access_token: Annotated[str | None, Cookie()] = None,
) -> Usuario:
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se proporcionó un token de autenticación",
        )

    try:
        payload = jwt.decode(
            access_token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        usuario_id = payload.get("sub")

        if usuario_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
            )

        usuario_id = int(usuario_id)

    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )

    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get(usuario_id)

        if usuario is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado",
            )

        return usuario


def get_current_active_user(
    current_user: Annotated[Usuario, Depends(get_current_user)],
) -> Usuario:
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )

    return current_user


def require_role(roles: list[str]):
    def role_checker(
        current_user: Annotated[
            Usuario,
            Depends(get_current_active_user),
        ],
    ) -> Usuario:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tenés permisos para realizar esta operación",
            )

        return current_user

    return role_checker
