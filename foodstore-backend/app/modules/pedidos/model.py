from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel

from app.modules.usuarios.model import Usuario

from .enums import EstadoPedido, FormaPago


class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)

    usuario_id: int = Field(
        foreign_key="usuarios.id",
        nullable=False,
    )

    estado: EstadoPedido = Field(
        default=EstadoPedido.PENDIENTE,
        nullable=False,
    )

    forma_pago: FormaPago = Field(nullable=False)

    direccion_entrega: str = Field(
        min_length=5,
        max_length=200,
        nullable=False,
    )

    notas: str | None = Field(default=None)

    total: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=10,
        decimal_places=2,
        nullable=False,
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
    )

    usuario: Usuario = Relationship()

    detalles: list["DetallePedido"] = Relationship(
        back_populates="pedido",
        sa_relationship_kwargs={"lazy": "selectin"},
    )


class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalles_pedido"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)

    pedido_id: int = Field(
        foreign_key="pedidos.id",
        nullable=False,
    )

    producto_id: int = Field(
        foreign_key="productos.id",
        nullable=False,
    )

    cantidad: int = Field(ge=1, nullable=False)

    nombre_producto: str = Field(
        max_length=120,
        nullable=False,
    )

    precio_unitario: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
        nullable=False,
    )

    subtotal: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
        nullable=False,
    )

    pedido: Pedido = Relationship(back_populates="detalles")

    __table_args__ = (UniqueConstraint("pedido_id", "producto_id"),)
