from decimal import Decimal

from sqlmodel import Field, Relationship, SQLModel

from ..categorias.model import Categoria


class Producto(SQLModel, table=True):
    __tablename__ = "productos"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)

    categoria_id: int = Field(
        foreign_key="categorias.id",
        nullable=False,
    )

    nombre: str = Field(min_length=3, max_length=120, nullable=False)

    descripcion: str | None = Field(default=None)

    precio_base: Decimal = Field(
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    imagen_url: str | None = Field(default=None)

    stock: int = Field(default=0, ge=0, nullable=False)

    disponible: bool = Field(default=True, nullable=False)

    activo: bool = Field(default=True, nullable=False)

    categoria: Categoria = Relationship(back_populates="productos")
