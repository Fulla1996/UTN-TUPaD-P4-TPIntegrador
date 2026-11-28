from datetime import UTC, datetime
from decimal import Decimal

from app.modules.usuarios.exceptions import PedidoAjeno

from .enums import EstadoPedido
from .exceptions import (
    PedidoNoEncontrado,
    ProductoNoEncontrado,
    StockInsuficiente,
    TransicionEstadoInvalida,
)
from .model import DetallePedido, Pedido
from .schema import PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from .unit_of_work import PedidoUnitOfWork


def crear(data: PedidoCreate, usuario_id: int) -> Pedido:
    with PedidoUnitOfWork() as uow:
        # Acumular cantidades de productos repetidos.
        cantidades_por_producto = {}

        for detalle in data.items:
            cantidades_por_producto[detalle.producto_id] = (
                cantidades_por_producto.get(detalle.producto_id, 0) + detalle.cantidad
            )

        pedido = Pedido(
            usuario_id=usuario_id,
            estado=EstadoPedido.PENDIENTE,
            forma_pago=data.forma_pago,
            direccion_entrega=data.direccion_entrega,
            notas=data.notas,
        )

        uow.pedidos.create(pedido)

        if pedido.id is None:
            raise RuntimeError("No se pudo generar el ID del pedido.")

        total = Decimal("0.00")

        # Crear detalles y descontar stock.
        for producto_id, cantidad in cantidades_por_producto.items():
            producto = uow.productos.get(producto_id)

            if producto is None or not producto.activo or not producto.disponible:
                raise ProductoNoEncontrado(
                    f"El producto con ID {producto_id} no existe o no está disponible."
                )

            if producto.id is None:
                raise RuntimeError("Error inesperado: El producto no tiene ID generado")

            if producto.stock < cantidad:
                raise StockInsuficiente(
                    f"Stock insuficiente para el producto '{producto.nombre}'."
                )

            producto.stock -= cantidad
            uow.productos.update(producto)

            subtotal = producto.precio_base * cantidad

            detalle = DetallePedido(
                pedido_id=pedido.id,
                producto_id=producto.id,
                cantidad=cantidad,
                nombre_producto=producto.nombre,
                precio_unitario=producto.precio_base,
                subtotal=subtotal,
            )

            uow.detalles.create(detalle)

            total += subtotal

        pedido.total = total
        uow.pedidos.update(pedido)

        if uow.session is None:
            raise RuntimeError("La sesión se cerró inesperadamente.")

        uow.session.refresh(pedido, attribute_names=["detalles"])

        return pedido


def obtener_todos(
    usuario_id: int,
    es_admin: bool,
    skip: int = 0,
    limit: int = 20,
    estado: EstadoPedido | None = None,
) -> PedidosPaginados:
    with PedidoUnitOfWork() as uow:
        total, pedidos = uow.pedidos.obtener_todos(
            skip=skip,
            limit=limit,
            usuario_id=None if es_admin else usuario_id,
            estado=estado,
        )

        return PedidosPaginados(
            total=total,
            items=[PedidoRead.model_validate(pedido) for pedido in pedidos],
        )


def obtener_por_id(
    pedido_id: int,
    usuario_id: int,
    es_admin: bool,
) -> Pedido:
    with PedidoUnitOfWork() as uow:
        pedido = uow.pedidos.get(pedido_id)

        if pedido is None:
            raise PedidoNoEncontrado(f"No existe el pedido con ID {pedido_id}.")
        if not es_admin and pedido.usuario_id != usuario_id:
            raise PedidoAjeno("Solo puedes acceder a tus propios pedidos.")

        return pedido


def actualizar(
    pedido_id: int,
    estado: EstadoPedido,
    usuario_id: int,
    es_admin: bool,
) -> Pedido:
    with PedidoUnitOfWork() as uow:
        pedido = uow.pedidos.get(pedido_id)

        if pedido is None:
            raise PedidoNoEncontrado(f"No existe el pedido con ID {pedido_id}.")

        # Definir las transiciones permitidas.
        transiciones = {
            EstadoPedido.PENDIENTE: {
                EstadoPedido.EN_PREPARACION,
                EstadoPedido.CANCELADO,
            },
            EstadoPedido.EN_PREPARACION: {
                EstadoPedido.ENTREGADO,
                EstadoPedido.CANCELADO,
            },
            EstadoPedido.ENTREGADO: set(),
            EstadoPedido.CANCELADO: set(),
        }

        if estado not in transiciones[pedido.estado]:
            raise TransicionEstadoInvalida(
                f"No se puede cambiar el estado de "
                f"{pedido.estado.value} a {estado.value}."
            )

        # Validar permisos.
        if not es_admin:
            if pedido.usuario_id != usuario_id:
                raise PedidoNoEncontrado(f"No existe el pedido con ID {pedido_id}.")

            if (
                pedido.estado != EstadoPedido.PENDIENTE
                or estado != EstadoPedido.CANCELADO
            ):
                raise TransicionEstadoInvalida(
                    "Solo se pueden cancelar pedidos pendientes propios."
                )

        # Restituir stock cuando se cancela el pedido.
        if estado == EstadoPedido.CANCELADO:
            for detalle in pedido.detalles:
                producto = uow.productos.get(detalle.producto_id)

                if producto is None:
                    raise ProductoNoEncontrado(
                        f"No se encontró el producto con ID {detalle.producto_id}."
                    )

                producto.stock += detalle.cantidad
                uow.productos.update(producto)

        pedido.estado = estado
        pedido.updated_at = datetime.now(UTC)

        return uow.pedidos.update(pedido)


def obtener_resumen() -> ResumenPedidos:
    with PedidoUnitOfWork() as uow:
        if uow.session is None:
            raise RuntimeError("La sesión no está inicializada")

        resumen = uow.pedidos.obtener_resumen()

    return ResumenPedidos(**resumen)
