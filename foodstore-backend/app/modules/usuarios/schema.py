from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.modules.usuarios.enums import Rol


class UsuarioCreate(BaseModel):
    username: str = Field(..., max_length=80)
    full_name: str = Field(..., max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8)


class UsuarioPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    full_name: str
    email: EmailStr
    created_at: datetime
    disabled: bool
    role: Rol