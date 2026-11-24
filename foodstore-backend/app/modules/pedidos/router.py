from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.core.security import get_current_active_user, require_role
from app.modules.usuarios import service as usuarios_service
from app.modules.usuarios.model import Usuario

from . import service
from .exceptions import (
    PedidoNoEncontrado,
    ProductoDuplicado,
    ProductoNoEncontrado,
)
from .schema import EstadoPedidoRead, PedidoCreate, PedidoRead, PedidoUpdate

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.post(
    "/",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear(
    data: PedidoCreate,
    current_user: Annotated[Usuario, Depends(get_current_active_user)],
):
    if current_user.id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario inválido"
        )
    try:
        return service.crear(data, current_user.id)

    except ProductoDuplicado as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )

    except ProductoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/", response_model=list[PedidoRead])
def obtener_todos(current_user: Annotated[Usuario, Depends(get_current_active_user)]):
    if current_user.id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario inválido"
        )
    es_admin = obtener_es_admin(current_user)

    return service.obtener_todos(current_user.id, es_admin)


@router.get("/estados", response_model=list[EstadoPedidoRead])
def obtener_estados(
    _: Annotated[Usuario, Depends(get_current_active_user)],
):
    return service.obtener_estados()

@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_por_id(
    pedido_id: int, current_user: Annotated[Usuario, Depends(get_current_active_user)]
):
    if current_user.id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario inválido"
        )
    es_admin = obtener_es_admin(current_user)
    try:
        return service.obtener_por_id(pedido_id, current_user.id, es_admin)

    except PedidoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.put("/{pedido_id}", response_model=PedidoRead)
def actualizar(
    pedido_id: int,
    data: PedidoUpdate,
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
):
    try:
        return service.actualizar(pedido_id, data.estado)

    except PedidoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.delete(
    "/{pedido_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar(
    pedido_id: int,
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
):
    try:
        service.eliminar(pedido_id)
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    except PedidoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


def obtener_es_admin(usuario: Usuario) -> bool:
    if usuario.id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario inválido"
        )

    usuario_publico = usuarios_service.obtener_publico(usuario.id)
    return "admin" in usuario_publico.roles
