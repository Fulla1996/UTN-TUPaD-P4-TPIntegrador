from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.security import get_current_active_user, require_role
from app.modules.pedidos.enums import EstadoPedido
from app.modules.usuarios.enums import Rol
from app.modules.usuarios.exceptions import PedidoAjeno
from app.modules.usuarios.model import Usuario

from . import service
from .exceptions import (
    PedidoNoEncontrado,
    ProductoNoEncontrado,
    StockInsuficiente,
    TransicionEstadoInvalida,
)
from .schema import (
    CambioEstado,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)

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
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inválido",
        )

    try:
        return service.crear(data, current_user.id)

    except ProductoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    except StockInsuficiente as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )


@router.get("/", response_model=PedidosPaginados)
@router.get("/", response_model=PedidosPaginados)
def obtener_todos(
    current_user: Annotated[Usuario, Depends(get_current_active_user)],
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    estado: EstadoPedido | None = Query(default=None),
):
    if current_user.id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inválido",
        )

    es_admin = current_user.role == Rol.ADMIN

    return service.obtener_todos(
        current_user.id,
        es_admin,
        skip,
        limit,
        estado,
    )


@router.get("/resumen", response_model=ResumenPedidos)
def obtener_resumen(_: Annotated[Usuario, Depends(require_role(["admin"]))]):
    return service.obtener_resumen()


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_por_id(
    pedido_id: int,
    current_user: Annotated[Usuario, Depends(get_current_active_user)],
):
    if current_user.id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inválido",
        )

    es_admin = current_user.role == Rol.ADMIN

    try:
        return service.obtener_por_id(
            pedido_id,
            current_user.id,
            es_admin,
        )

    except PedidoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except PedidoAjeno as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.patch("/{pedido_id}", response_model=PedidoRead)
def actualizar(
    pedido_id: int,
    data: CambioEstado,
    current_user: Annotated[Usuario, Depends(get_current_active_user)],
):
    if current_user.id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inválido",
        )

    es_admin = current_user.role == Rol.ADMIN

    try:
        return service.actualizar(
            pedido_id,
            data.estado,
            current_user.id,
            es_admin,
        )

    except PedidoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    except TransicionEstadoInvalida as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except ProductoNoEncontrado as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
