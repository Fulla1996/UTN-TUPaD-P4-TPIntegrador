from datetime import UTC, datetime
from decimal import Decimal

from sqlmodel import Field, Relationship, SQLModel

from app.modules.usuarios.model import Usuario


class Pedido(SQLModel, table=True):
    __tablename__ = "pedidos"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)
    fecha: datetime = Field(default_factory=lambda: datetime.now(UTC))
    estado_id: int = Field(foreign_key="estados_pedido.id")
    total: Decimal = Field(default=Decimal("0.00"), nullable=False)
    activo: bool = Field(default=True, nullable=False)
    deleted_at: datetime | None = Field(default=None)
    usuario_id: int = Field(foreign_key="usuarios.id")
    
    usuario: "Usuario" = Relationship()
    detalles: list["DetallePedido"] = Relationship(
        back_populates="pedido", sa_relationship_kwargs={"lazy": "selectin"}
    )
    estado_relacion: "EstadoPedido" = Relationship(
        sa_relationship_kwargs={"lazy": "selectin"}
    )

    @property
    def estado(self) -> str:
        return self.estado_relacion.nombre


class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalles_pedido"  # type: ignore

    pedido_id: int = Field(foreign_key="pedidos.id", primary_key=True)
    producto_id: int = Field(foreign_key="productos.id", primary_key=True)

    cantidad: int = Field(..., ge=1)
    precio_unitario: Decimal = Field(..., ge=0, max_digits=10, decimal_places=2)

    pedido: Pedido = Relationship(back_populates="detalles")


class EstadoPedido(SQLModel, table=True):
    __tablename__ = "estados_pedido"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=30, unique=True, nullable=False)
    descripcion: str | None = Field(default=None)