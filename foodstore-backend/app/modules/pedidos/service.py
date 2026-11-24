from datetime import UTC, datetime
from decimal import Decimal

from sqlmodel import col, select

from .exceptions import PedidoNoEncontrado, ProductoDuplicado, ProductoNoEncontrado
from .model import DetallePedido, EstadoPedido, Pedido
from .schema import PedidoCreate
from .unit_of_work import PedidoUnitOfWork


def crear(data: PedidoCreate, usuario_id: int) -> Pedido:
    with PedidoUnitOfWork() as uow:
        # Evitar productos duplicados
        productos_ids = [detalle.producto_id for detalle in data.detalles]

        if len(productos_ids) != len(set(productos_ids)):
            raise ProductoDuplicado("No se pueden repetir productos en un pedido")

        # Crear el pedido
        if uow.session is None:
            raise RuntimeError("Error al obtener la sesión")

        statement = select(EstadoPedido).where(col(EstadoPedido.nombre) == "PENDIENTE")
        estado_pendiente = uow.session.exec(statement).first()

        if estado_pendiente is None or estado_pendiente.id is None:
            raise RuntimeError("No se encontró el estado PENDIENTE")

        pedido = Pedido(usuario_id=usuario_id, estado_id=estado_pendiente.id)
        uow.pedidos.create(pedido)

        if pedido.id is None:
            raise RuntimeError("No se pudo generar el ID del pedido")
        # Crear los detalles y calcular el total
        total = Decimal("0.00")

        for detalle_data in data.detalles:
            producto = uow.productos.get(detalle_data.producto_id)

            if producto is None:
                raise ProductoNoEncontrado(
                    f"No existe el producto con ID {detalle_data.producto_id}"
                )
            if producto.id is None:
                raise RuntimeError("El producto no tiene un ID asignado")

            detalle = DetallePedido(
                pedido_id=pedido.id,
                producto_id=producto.id,
                cantidad=detalle_data.cantidad,
                precio_unitario=producto.precio_base,
            )

            uow.detalles.create(detalle)

            total += detalle.cantidad * detalle.precio_unitario

        pedido.total = total
        uow.pedidos.update(pedido)

        if uow.session is None:
            raise RuntimeError("La sesión se cerró inesperadamente")

        uow.session.refresh(
            pedido,
            attribute_names=["detalles", "estado_relacion"],
        )

        return pedido


def obtener_todos(usuario_id: int, es_admin: bool) -> list[Pedido]:
    with PedidoUnitOfWork() as uow:
        pedidos = uow.pedidos.get_all()

        return [
            pedido
            for pedido in pedidos
            if pedido.activo and (es_admin or pedido.usuario_id == usuario_id)
        ]


def obtener_por_id(pedido_id: int, usuario_id: int, es_admin: bool) -> Pedido:
    with PedidoUnitOfWork() as uow:
        pedido = uow.pedidos.get(pedido_id)

        if (
            pedido is None
            or not pedido.activo
            or (not es_admin and pedido.usuario_id != usuario_id)
        ):
            raise PedidoNoEncontrado(f"No existe el pedido con ID {pedido_id}")

        return pedido


def actualizar(pedido_id: int, estado: str) -> Pedido:
    with PedidoUnitOfWork() as uow:
        if uow.session is None:
            raise RuntimeError("Error al obtener la sesión")

        pedido = uow.pedidos.get(pedido_id)

        if pedido is None or not pedido.activo:
            raise PedidoNoEncontrado(f"No existe el pedido con ID {pedido_id}")

        estado_pedido = uow.session.exec(
            select(EstadoPedido).where(EstadoPedido.nombre == estado)
        ).first()

        if estado_pedido is None or estado_pedido.id is None:
            raise ValueError(f"El estado '{estado}' no existe")

        pedido.estado_id = estado_pedido.id

        return uow.pedidos.update(pedido)


def eliminar(pedido_id: int) -> None:
    with PedidoUnitOfWork() as uow:
        pedido = uow.pedidos.get(pedido_id)

        if pedido is None or pedido.deleted_at is not None:
            raise PedidoNoEncontrado(f"No existe el pedido con ID {pedido_id}")

        pedido.activo = False
        pedido.deleted_at = datetime.now(UTC)

        uow.pedidos.update(pedido)


def obtener_estados() -> list[EstadoPedido]:
    with PedidoUnitOfWork() as uow:
        return uow.estados_pedido.get_all()
