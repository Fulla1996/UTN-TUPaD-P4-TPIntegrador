from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.repository import CategoriaRepository

from .repository import (
    ProductoRepository,
)


class ProductoUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()

        if self.session is None:
            raise RuntimeError("No se pudo inicializar la sesión")

        self.productos = ProductoRepository(self.session)
        self.categorias = CategoriaRepository(self.session)
        return self