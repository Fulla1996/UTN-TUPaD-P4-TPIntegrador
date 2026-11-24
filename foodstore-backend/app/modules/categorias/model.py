from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from ..productos.model import Producto


class Categoria(SQLModel, table=True):
    __tablename__ = "categorias"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)

    nombre: str = Field(
        min_length=3,
        max_length=80,
        nullable=False,
    )

    descripcion: str | None = Field(default=None)

    activo: bool = Field(default=True, nullable=False)

    productos: list["Producto"] = Relationship(
        back_populates="categoria"
    )