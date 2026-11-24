from sqlmodel import Session, col, select

from app.core.repository import BaseRepository

from .model import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def obtener_todas(
        self,
        activo: bool | None = None,
        search: str | None = None,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Categoria]:

        statement = select(Categoria)

        if activo is not None:
            statement = statement.where(Categoria.activo == activo)
        else:
            statement = statement.where(Categoria.activo == True)

        if search:
            statement = statement.where(
                col(Categoria.nombre).ilike(f"%{search.strip()}%")
            )

        statement = statement.offset(skip).limit(limit)

        return list(self.session.exec(statement).all())

    def existe_nombre(
        self,
        nombre: str,
        excluir_id: int | None = None,
    ) -> bool:
        statement = (
            select(Categoria)
            .where(col(Categoria.nombre).ilike(nombre))
            .where(Categoria.activo == True)
        )

        if excluir_id is not None:
            statement = statement.where(Categoria.id != excluir_id)

        return self.session.exec(statement).first() is not None
