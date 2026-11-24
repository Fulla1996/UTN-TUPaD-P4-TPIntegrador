
from app.core.unit_of_work import UnitOfWork

from .repository import (
    DetallePedidoRepository,
    EstadoPedidoRepository,
    PedidoRepository,
    ProductoRepository,
)


class PedidoUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()

        if self.session is None:
            raise RuntimeError("No se pudo inicializar la sesión")

        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
        self.estados_pedido = EstadoPedidoRepository(self.session)

        return self