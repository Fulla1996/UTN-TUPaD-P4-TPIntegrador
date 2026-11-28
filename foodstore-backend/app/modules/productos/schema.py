from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.modules.categorias.schema import CategoriaRead


class ProductoBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=120)
    descripcion: str | None = None

    precio_base: Decimal = Field(
        ...,
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    imagen_url: str | None = None

    stock: int = Field(default=0, ge=0)

    disponible: bool = True


class ProductoCreate(ProductoBase):
    categoria_id: int


class ProductoUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=3, max_length=120)
    descripcion: str | None = None
    precio_base: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=10,
        decimal_places=2,
    )
    stock: int | None = Field(default=None, ge=0)
    imagen_url: str | None = None
    categoria_id: int | None = None
    disponible: bool | None = None


class ProductoRead(ProductoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    categoria_id: int
    activo: bool
    categoria: CategoriaRead

class ProductosPaginados(BaseModel):
    total: int
    items: list[ProductoRead]