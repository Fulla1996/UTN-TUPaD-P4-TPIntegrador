import { api } from "@/shared/api/axiosInstance";

import type {
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
} from "../types/pedido.types";

// Crear un pedido
export const crearPedido = async (
    pedido: PedidoCreate,
): Promise<PedidoRead> => {
    const response = await api.post<PedidoRead>("/pedidos/", pedido);

    return response.data;
};

// Obtener pedidos paginados
export const obtenerPedidos = async (
    skip = 0,
    limit = 10,
    estado?: EstadoPedido,
): Promise<PedidosPaginados> => {
    const response = await api.get<PedidosPaginados>("/pedidos/", {
        params: {
            skip,
            limit,
            estado,
        },
    });

    return response.data;
};

// Obtener un pedido por ID
export const obtenerPedido = async (
    pedidoId: number,
): Promise<PedidoRead> => {
    const response = await api.get<PedidoRead>(
        `/pedidos/${pedidoId}`,
    );

    return response.data;
};

// Actualizar el estado de un pedido
export const actualizarEstadoPedido = async (
    pedidoId: number,
    data: CambioEstado,
): Promise<PedidoRead> => {
    const response = await api.patch<PedidoRead>(
        `/pedidos/${pedidoId}`,
        data,
    );

    return response.data;
};

// Obtener resumen administrativo
export const obtenerResumenPedidos =
    async (): Promise<ResumenPedidos> => {
        const response = await api.get<ResumenPedidos>(
            "/pedidos/resumen",
        );

        return response.data;
    };