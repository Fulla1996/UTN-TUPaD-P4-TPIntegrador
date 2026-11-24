from sqlmodel import Session, col, select

from app.core.repository import BaseRepository

from .model import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def obtener_todos(
        self,
        skip: int = 0,
        limit: int = 20,
        activo: bool | None = None,
        disponible: bool | None = None,
        categoria_id: int | None = None,
        search: str | None = None,
    ) -> tuple[int, list[Producto]]:
        statement = select(Producto)

        if activo is not None:
            statement = statement.where(Producto.activo == activo)
        else:
            statement = statement.where(Producto.activo == True)

        if disponible is not None:
            statement = statement.where(Producto.disponible == disponible)

        if categoria_id is not None:
            statement = statement.where(Producto.categoria_id == categoria_id)

        if search and search.strip():
            statement = statement.where(
                col(Producto.nombre).ilike(f"%{search.strip()}%")
            )

        total = len(self.session.exec(statement).all())

        statement = statement.offset(skip).limit(limit)
    
        productos = list(self.session.exec(statement).all())

        return total, productos

    def existe_nombre(
        self,
        nombre: str,
        excluir_id: int | None = None,
    ) -> bool:
        statement = (
            select(Producto)
            .where(col(Producto.nombre).ilike(nombre))
            .where(Producto.activo == True)
        )

        if excluir_id is not None:
            statement = statement.where(Producto.id != excluir_id)

        return self.session.exec(statement).first() is not None
