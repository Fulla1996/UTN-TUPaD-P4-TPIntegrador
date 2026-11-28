import type { EstadoPedido, PedidoRead } from "../types/pedido.types";

import { useAuthStore } from "@/store/authStore";
import { useActualizarEstadoPedido } from "../hooks/usePedidos";
import { useNotificationStore } from "@/store/notificationStore";

interface PedidoCardProps {
    pedido: PedidoRead;
}

const obtenerEtiquetaEstado = (estado: EstadoPedido): string => {
    const etiquetas: Record<EstadoPedido, string> = {
        PENDIENTE: "Pendiente",
        EN_PREPARACION: "En preparación",
        ENTREGADO: "Entregado",
        CANCELADO: "Cancelado",
    };

    return etiquetas[estado];
};

const obtenerEstiloEstado = (estado: EstadoPedido): string => {
    const estilos: Record<EstadoPedido, string> = {
        PENDIENTE: "bg-yellow-100 text-yellow-800",
        EN_PREPARACION: "bg-blue-100 text-blue-800",
        ENTREGADO: "bg-green-100 text-green-800",
        CANCELADO: "bg-red-100 text-red-800",
    };

    return estilos[estado];
};

const formatearFecha = (fecha: string): string =>
    new Date(fecha).toLocaleString("es-AR", {
        dateStyle: "medium",
        timeStyle: "short",
    });

const formatearImporte = (importe: number | string): string =>
    Number(importe).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
    });

function PedidoCard({ pedido }: PedidoCardProps) {
    const usuario = useAuthStore((state) => state.user);
    const actualizarPedido = useActualizarEstadoPedido();
    const showNotification = useNotificationStore(
        (state) => state.showNotification
    );

    const esAdmin = usuario?.role === "admin";
    const esUsuario = usuario?.role === "user";

    const esEstadoFinal =
        pedido.estado === "ENTREGADO" || pedido.estado === "CANCELADO";

    const puedeCancelarUsuario =
        esUsuario && pedido.estado === "PENDIENTE";

    const puedeGestionarAdmin = esAdmin && !esEstadoFinal;

    const siguienteEstado: EstadoPedido | null =
        pedido.estado === "PENDIENTE"
            ? "EN_PREPARACION"
            : pedido.estado === "EN_PREPARACION"
                ? "ENTREGADO"
                : null;

    const cambiarEstado = async (estado: EstadoPedido) => {
        try {
            await actualizarPedido.mutateAsync({
                pedidoId: pedido.id,
                data: { estado },
            });

            showNotification(
                estado === "CANCELADO"
                    ? "Pedido cancelado correctamente"
                    : `Pedido actualizado a ${obtenerEtiquetaEstado(estado)}`
            );
        } catch (error) {
            showNotification(
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar el pedido"
            );
        }
    };

    return (
        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Pedido #{pedido.id}
                    </h2>
                    <p className="text-sm text-muted">
                        {formatearFecha(pedido.created_at)}
                    </p>
                </div>

                <span
                    className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${obtenerEstiloEstado(pedido.estado)}`}
                >
                    {obtenerEtiquetaEstado(pedido.estado)}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-muted">Forma de pago</p>
                    <p className="font-medium text-foreground">
                        {pedido.forma_pago === "EFECTIVO" ? "Efectivo" : "Transferencia"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted">Dirección de entrega</p>
                    <p className="font-medium text-foreground">
                        {pedido.direccion_entrega}
                    </p>
                </div>
            </div>

            <div className="border-t border-border pt-4">
                <h3 className="mb-3 font-semibold text-foreground">
                    Productos del pedido
                </h3>

                <div className="space-y-3">
                    {pedido.detalles.map((detalle) => (
                        <div
                            key={detalle.id}
                            className="flex flex-col justify-between gap-1 text-sm sm:flex-row sm:items-center"
                        >
                            <div>
                                <p className="font-medium text-foreground">
                                    {detalle.nombre_producto}
                                </p>
                                <p className="text-muted">
                                    {detalle.cantidad} ×{" "}
                                    {formatearImporte(detalle.precio_unitario)}
                                </p>
                            </div>

                            <p className="font-medium text-foreground">
                                {formatearImporte(detalle.subtotal)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {pedido.notas && (
                <div className="mt-4 rounded-lg bg-background p-3">
                    <p className="text-sm font-medium text-foreground">Notas</p>
                    <p className="text-sm text-muted">{pedido.notas}</p>
                </div>
            )}

            <div className="mt-4 flex justify-between border-t border-border pt-4">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">
                    {formatearImporte(pedido.total)}
                </span>
            </div>

            {(puedeCancelarUsuario || puedeGestionarAdmin) && (
                <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                    {puedeGestionarAdmin && siguienteEstado && (
                        <button
                            type="button"
                            onClick={() => cambiarEstado(siguienteEstado)}
                            disabled={actualizarPedido.isPending}
                            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {actualizarPedido.isPending
                                ? "Actualizando..."
                                : siguienteEstado === "EN_PREPARACION"
                                    ? "Iniciar preparación"
                                    : "Marcar como entregado"}
                        </button>
                    )}

                    {(puedeCancelarUsuario || puedeGestionarAdmin) && (
                        <button
                            type="button"
                            onClick={() => cambiarEstado("CANCELADO")}
                            disabled={actualizarPedido.isPending}
                            className="btn btn-soft-danger disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {actualizarPedido.isPending
                                ? "Procesando..."
                                : "Cancelar pedido"}
                        </button>
                    )}
                </div>
            )}
        </article>
    );
}

export default PedidoCard;