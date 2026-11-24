from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class DetallePedidoCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(..., ge=1)


class PedidoCreate(BaseModel):
    detalles: list[DetallePedidoCreate] = Field(..., min_length=1)


class PedidoUpdate(BaseModel):
    estado: Literal[
        "PENDIENTE",
        "CONFIRMADO",
        "EN_PREPARACION",
        "EN_CAMINO",
        "ENTREGADO",
        "CANCELADO",
    ]


class DetallePedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    pedido_id: int
    producto_id: int
    cantidad: int
    precio_unitario: Decimal


class PedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha: datetime
    estado: str
    total: Decimal
    activo: bool
    deleted_at: datetime | None
    detalles: list[DetallePedidoRead]

class EstadoPedidoRead(BaseModel):
    id: int
    nombre: str
    descripcion: str