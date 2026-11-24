from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    crear_access_token,
    get_current_active_user,
    require_role,
)
from app.modules.usuarios.model import Usuario

from . import service
from .exceptions import (
    EmailDuplicado,
    NoPuedeDesactivarseASiMismo,
    UserNameDuplicado,
    UsuarioDesactivado,
    UsuarioNoEncontrado,
    UsuarioYaActivo,
)
from .schema import UsuarioCreate, UsuarioPublic

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post(
    "/register",
    response_model=UsuarioPublic,
    status_code=status.HTTP_201_CREATED,
)
def registrar_usuario(data: UsuarioCreate):
    try:
        return service.registrar(data)

    except EmailDuplicado as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )
    except UserNameDuplicado as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )


@router.post("/token")
def iniciar_sesion(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    try:
        usuario = service.autenticar(
            email=form_data.username,
            password=form_data.password,
        )
    except UsuarioNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
    except UsuarioDesactivado as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    if usuario.id is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo identificar al usuario",
        )

    access_token = crear_access_token(data={"sub": str(usuario.id)})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    return {"message": "Inicio de sesión exitoso"}


@router.post("/logout", status_code=status.HTTP_200_OK)
def cerrar_sesion(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax",
    )

    return {"message": "Sesión cerrada correctamente"}


@router.get("/me", response_model=UsuarioPublic)
def obtener_usuario_actual(
    current_user: Annotated[Usuario, Depends(get_current_active_user)],
):
    if current_user.id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inválido",
        )

    try:
        return service.obtener_por_id(current_user.id)
    except UsuarioNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get(
    "/admin/usuarios",
    response_model=list[UsuarioPublic],
    status_code=status.HTTP_200_OK,
)
def obtener_usuarios(
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100)
):
    return service.obtener_todos(skip, limit)


@router.post(
    "/admin/usuarios/{usuario_id}/activar",
    response_model=UsuarioPublic,
    status_code=status.HTTP_200_OK,
)
def activar_usuario(
    usuario_id: int,
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
):
    try:
        return service.activar(usuario_id)
    except UsuarioNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except UsuarioYaActivo as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post(
    "/admin/usuarios/{usuario_id}/desactivar",
    response_model=UsuarioPublic,
    status_code=status.HTTP_200_OK,
)
def desactivar_usuario(
    usuario_id: int,
    admin: Annotated[Usuario, Depends(require_role(["admin"]))],
):
    if admin.id is None:
        raise RuntimeError("El ID del admin no fue encontrado.")
    try:
        return service.desactivar(usuario_id, admin.id)
    except UsuarioNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except UsuarioDesactivado as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    except NoPuedeDesactivarseASiMismo as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
