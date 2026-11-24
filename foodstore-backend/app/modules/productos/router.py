from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Response, status

from app.core.security import get_current_active_user, require_role
from app.modules.usuarios.model import Usuario

from ..categorias.exceptions import CategoriaDesactivada, CategoriaNoExiste
from . import schema, service
from .exceptions import (
    NombreDuplicado,
    ProductoDesactivado,
)

router = APIRouter(prefix="/productos", tags=["Productos"])


# ---------------------------------------------------------
# ALTA DE PRODUCTO
# Método: POST | Endpoint: / | Estado: 201 Created
# ---------------------------------------------------------
@router.post(
    "/",
    response_model=schema.ProductoRead,
    status_code=status.HTTP_201_CREATED,
)
def alta_producto(
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
    producto: schema.ProductoCreate,
):
    try:
        return service.crear(producto)

    except CategoriaNoExiste as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    except CategoriaDesactivada as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

    except NombreDuplicado as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )


# ---------------------------------------------------------
# LISTAR PRODUCTOS
# Método: GET | Endpoint: / | Estado: 200 OK
# ---------------------------------------------------------
@router.get(
    "/",
    response_model=schema.ProductosPaginados,
    status_code=status.HTTP_200_OK,
)
def listar_productos(
    _: Annotated[Usuario, Depends(get_current_active_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100, ge=1),
    activo: bool | None = Query(None),
    disponible: bool | None = Query(None),
    categoria_id: int | None = Query(None),
    search: str | None = Query(None),
):
    return service.obtener_todos(
        skip,
        limit,
        activo,
        disponible,
        categoria_id,
        search,
    )


# ---------------------------------------------------------
# DETALLE DE PRODUCTO
# Método: GET | Endpoint: /{id} | Estado: 200 OK
# ---------------------------------------------------------
@router.get(
    "/{id}",
    response_model=schema.ProductoRead,
    status_code=status.HTTP_200_OK,
)
def detalle_producto(
    _: Annotated[Usuario, Depends(get_current_active_user)],
    id: int = Path(..., gt=0),
):
    producto = service.obtener_por_id(id)

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    return producto


# ---------------------------------------------------------
# ACTUALIZACIÓN PARCIAL
# Método: PATCH | Endpoint: /{id} | Estado: 200 OK
# ---------------------------------------------------------
@router.patch(
    "/{id}",
    response_model=schema.ProductoRead,
    status_code=status.HTTP_200_OK,
)
def actualizar_producto(
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
    producto: schema.ProductoUpdate,
    id: int = Path(..., gt=0),
):
    try:
        actualizado = service.actualizar(id, producto)

    except ProductoDesactivado as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

    except CategoriaNoExiste as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    except CategoriaDesactivada as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

    except NombreDuplicado as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

    if actualizado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    return actualizado


# ---------------------------------------------------------
# ACTUALIZAR STOCK
# Método: PATCH | Endpoint: /{id}/stock | Estado: 200 OK
# ---------------------------------------------------------
@router.patch(
    "/{id}/stock",
    response_model=schema.ProductoRead,
    status_code=status.HTTP_200_OK,
)
def actualizar_stock(
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
    nuevo_stock: int = Query(..., ge=0),
    id: int = Path(..., gt=0),
):
    try:
        actualizado = service.actualizar_stock(id, nuevo_stock)
    except ProductoDesactivado as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )
    if actualizado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    return actualizado


# ---------------------------------------------------------
# BORRADO LÓGICO
# Método: DELETE | Endpoint: /{id} | Estado: 204 No Content
# ---------------------------------------------------------
@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def borrado_logico(
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
):
    try:
        desactivado = service.desactivar(id)

    except ProductoDesactivado as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

    if desactivado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)