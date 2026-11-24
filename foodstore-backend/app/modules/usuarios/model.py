from datetime import UTC, datetime

from sqlalchemy import CHAR, BigInteger, Column, DateTime, String
from sqlmodel import Field, SQLModel

from app.modules.usuarios.enums import Rol


class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"  # type: ignore

    id: int | None = Field(
        default=None,
        primary_key=True,
        sa_type=BigInteger,
    )

    username: str = Field(max_length=80, unique=True, nullable=False)
    full_name: str = Field(max_length=120, nullable=False)

    email: str = Field(sa_column=Column(String(254), unique=True, nullable=False))

    hashed_password: str = Field(sa_column=Column(CHAR(60), nullable=False))

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        sa_type=DateTime(timezone=True),
        nullable=False,
    )

    disabled: bool = Field(default=False, nullable=False)

    role: Rol = Field(default="user", nullable=False)
