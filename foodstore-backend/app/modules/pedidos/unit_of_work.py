
from app.core.unit_of_work import UnitOfWork
from app.modules.productos.repository import ProductoRepository

from .repository import (
    DetallePedidoRepository,
    PedidoRepository,
)


class PedidoUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()

        if self.session is None:
            raise RuntimeError("No se pudo inicializar la sesión")

        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)

        return self