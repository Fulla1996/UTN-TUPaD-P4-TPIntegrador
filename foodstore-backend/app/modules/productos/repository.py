from sqlalchemy import func
from sqlmodel import Session, col, select

from app.core.repository import BaseRepository

from .model import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def get(self, id: int) -> Producto | None:
        statement = select(Producto).where(Producto.id == id)

        return self.session.exec(statement).first()

    def obtener_todos(
        self,
        skip: int = 0,
        limit: int = 20,
        activo: bool | None = None,
        disponible: bool | None = None,
        categoria_id: int | None = None,
        search: str | None = None,
        sort_by: str = "id",
        sort_order: str = "asc",
    ) -> tuple[int, list[Producto]]:
    
        statement = select(Producto)
        
        # Filtros
        if activo is not None:
            statement = statement.where(Producto.activo == activo)
    
        if disponible is not None:
            statement = statement.where(Producto.disponible == disponible)
    
        if categoria_id is not None:
            statement = statement.where(Producto.categoria_id == categoria_id)
    
        if search and search.strip():
            statement = statement.where(
                col(Producto.nombre).ilike(f"%{search.strip()}%")
            )
        
        # Total de registros que cumplen los filtros
        total_statement = select(func.count()).select_from(statement.subquery())
        total = self.session.exec(total_statement).one()
    
        # Columnas permitidas para ordenar
        columnas_ordenables = {
            "nombre": Producto.nombre,
            "precio_base": Producto.precio_base,
            "stock": Producto.stock,
            "descripcion": Producto.descripcion,
            "disponible": Producto.disponible,
            "activo": Producto.activo,
        }
    
        columna = columnas_ordenables.get(sort_by, Producto.id)
    
        # Ordenamiento
        if sort_order == "desc":
            statement = statement.order_by(columna.desc())
        else:
            statement = statement.order_by(columna.asc())
    
        # Paginación
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
