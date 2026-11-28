from datetime import UTC, datetime, timedelta

from sqlmodel import Session, col, func, select

from app.core.repository import BaseRepository

from .enums import EstadoPedido
from .model import DetallePedido, Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def obtener_todos(
        self,
        skip: int = 0,
        limit: int = 20,
        usuario_id: int | None = None,
        estado: EstadoPedido | None = None,
    ) -> tuple[int, list[Pedido]]:

        statement = select(Pedido)

        if usuario_id is not None:
            statement = statement.where(Pedido.usuario_id == usuario_id)

        if estado is not None:
            statement = statement.where(Pedido.estado == estado)

        # Calcular total
        total_statement = select(func.count()).select_from(statement.subquery())
        total = self.session.exec(total_statement).one()

        # Obtener pedidos paginados
        statement = (
            statement.order_by(col(Pedido.created_at).desc()).offset(skip).limit(limit)
        )

        pedidos = list(self.session.exec(statement).all())

        return total, pedidos

    def obtener_resumen(self) -> dict:
        ahora = datetime.now(UTC)
        inicio_dia = ahora.replace(hour=0, minute=0, second=0, microsecond=0)
        fin_dia = inicio_dia + timedelta(days=1)

        conteos = self.session.exec(
            select(
                Pedido.estado,
                func.count(col(Pedido.id)),
            ).group_by(Pedido.estado)
        ).all()

        cantidades = {estado: cantidad for estado, cantidad in conteos}

        pedidos_hoy = self.session.exec(
            select(func.count(col(Pedido.id))).where(
                Pedido.created_at >= inicio_dia,
                Pedido.created_at < fin_dia,
            )
        ).one()

        ingresos_entregados = self.session.exec(
            select(func.sum(Pedido.total)).where(
                Pedido.estado == EstadoPedido.ENTREGADO
            )
        ).one()

        return {
            "pendientes": cantidades.get(EstadoPedido.PENDIENTE, 0),
            "en_preparacion": cantidades.get(EstadoPedido.EN_PREPARACION, 0),
            "entregados": cantidades.get(EstadoPedido.ENTREGADO, 0),
            "cancelados": cantidades.get(EstadoPedido.CANCELADO, 0),
            "pedidos_hoy": pedidos_hoy or 0,
            "ingresos_entregados": ingresos_entregados or 0,
        }


class DetallePedidoRepository(BaseRepository[DetallePedido]):
    def __init__(self, session: Session):
        super().__init__(session, DetallePedido)
