from sqlmodel import Session, col, select

from app.core.repository import BaseRepository

from .model import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def obtener_todos(
        self,
        skip: int = 0,
        limit: int = 10,
        activo: bool | None = None,
        disponible: bool | None = None,
        categoria_id: int | None = None,
        search: str | None = None,
        hay_stock: bool | None = None,
    ) -> list[Producto]:
        statement = select(Producto)

        if activo is not None:
            statement = statement.where(Producto.activo == activo)
        else:
            statement = statement.where(Producto.activo == True)

        if disponible is not None:
            statement = statement.where(Producto.disponible == disponible)

        if categoria_id is not None:
            statement = statement.where(
                Producto.categoria_id == categoria_id
            )

        if hay_stock is not None:
            if hay_stock:
                statement = statement.where(Producto.stock > 0)
            else:
                statement = statement.where(Producto.stock == 0)

        if search and search.strip():
            statement = statement.where(
                col(Producto.nombre).ilike(f"%{search.strip()}%")
            )

        statement = statement.offset(skip).limit(limit)

        return list(self.session.exec(statement).all())

    def existe_nombre(
        self,
        nombre: str,
        excluir_id: int | None = None,
    ) -> bool:
        statement = select(Producto).where(
            col(Producto.nombre).ilike(nombre)
        )

        if excluir_id is not None:
            statement = statement.where(Producto.id != excluir_id)

        return self.session.exec(statement).first() is not None