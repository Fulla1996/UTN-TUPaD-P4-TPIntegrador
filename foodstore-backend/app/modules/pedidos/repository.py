from sqlmodel import Session

from app.core.repository import Repository
from app.modules.productos.model import Producto

from .model import DetallePedido, EstadoPedido, Pedido


class PedidoRepository(Repository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)


class DetallePedidoRepository(Repository[DetallePedido]):
    def __init__(self, session: Session):
        super().__init__(session, DetallePedido)


class ProductoRepository(Repository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

class EstadoPedidoRepository(Repository[EstadoPedido]):
    def __init__(self, session: Session):
        super().__init__(session, EstadoPedido)