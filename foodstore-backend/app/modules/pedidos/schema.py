from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from .enums import EstadoPedido, FormaPago


class ItemPedidoCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(..., ge=1)


class PedidoCreate(BaseModel):
    forma_pago: FormaPago

    direccion_entrega: str = Field(
        ...,
        min_length=5,
        max_length=200,
    )

    notas: str | None = None

    items: list[ItemPedidoCreate] = Field(
        ...,
        min_length=1,
    )


class CambioEstado(BaseModel):
    estado: EstadoPedido


class DetallePedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    producto_id: int
    cantidad: int
    nombre_producto: str
    precio_unitario: Decimal
    subtotal: Decimal


class PedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    usuario_id: int
    estado: EstadoPedido
    forma_pago: FormaPago
    direccion_entrega: str
    notas: str | None
    total: Decimal
    created_at: datetime
    updated_at: datetime
    detalles: list[DetallePedidoRead]


class PedidosPaginados(BaseModel):
    total: int
    items: list[PedidoRead]


class ResumenPedidos(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    pendientes: int = Field(default=0, ge=0)
    en_preparacion: int = Field(default=0, ge=0)
    entregados: int = Field(default=0, ge=0)
    cancelados: int = Field(default=0, ge=0)
    pedidos_hoy: int = Field(default=0, ge=0)
    ingresos_entregados: Decimal = Field(default=Decimal("0.00"), ge=0)
