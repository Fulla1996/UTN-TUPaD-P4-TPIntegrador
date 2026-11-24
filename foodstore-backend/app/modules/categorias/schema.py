from pydantic import BaseModel, ConfigDict, Field


class CategoriaBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=80)
    descripcion: str | None = None


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nombre: str | None = Field(None, min_length=3, max_length=80)
    descripcion: str | None = None


class CategoriaRead(CategoriaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    activo: bool
