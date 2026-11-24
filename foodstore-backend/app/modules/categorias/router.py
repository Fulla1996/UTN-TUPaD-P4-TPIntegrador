from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status

from app.core.security import get_current_active_user, require_role
from app.modules.usuarios.model import Usuario

from . import schema, service
from .exceptions import CategoriaDesactivada, NombreDuplicado

router = APIRouter(prefix="/categorias", tags=["Categorías"])

@router.post(
    "/", response_model=schema.CategoriaPublic, status_code=status.HTTP_201_CREATED
)
def alta_categoria(
    categoria: schema.CategoriaCreate,
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
):
    try:
        nueva_categoria = service.crear(categoria)
    except NombreDuplicado as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )
    return nueva_categoria


@router.get(
    "/", response_model=list[schema.CategoriaPublic], status_code=status.HTTP_200_OK
)
def listar_categorias(
    _: Annotated[Usuario, Depends(get_current_active_user)],
    activo: bool | None = Query(None),
    search: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50, ge=1),
):
    return service.obtener_todas(activo, search, skip, limit)


@router.get(
    "/{id}", response_model=schema.CategoriaPublic, status_code=status.HTTP_200_OK
)
def detalle_categoria(
    _: Annotated[Usuario, Depends(get_current_active_user)],
    id: int = Path(..., gt=0),
):
    categoria = service.obtener_por_id(id)
    if categoria is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada"
        )
    return categoria


@router.put(
    "/{id}", response_model=schema.CategoriaPublic, status_code=status.HTTP_200_OK
)
def actualizar_categoria(
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
    categoria: schema.CategoriaUpdate,
    id: int = Path(..., gt=0),
):
    try:
        actualizada = service.actualizar(id, categoria)
    except CategoriaDesactivada as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except NombreDuplicado as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )
    if not actualizada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría activa no encontrada para su modificación",
        )
    return actualizada


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def borrado_logico(
    _: Annotated[Usuario, Depends(require_role(["admin"]))],
    id: int = Path(..., gt=0),
):
    try:
        desactivada = service.desactivar(id)
    except CategoriaDesactivada as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    if not desactivada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría activa no encontrada para su desactivación",
        )
