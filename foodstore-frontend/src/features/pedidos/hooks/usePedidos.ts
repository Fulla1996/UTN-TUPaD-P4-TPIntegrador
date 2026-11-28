import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    actualizarEstadoPedido,
    crearPedido,
    obtenerPedido,
    obtenerPedidos,
    obtenerResumenPedidos,
} from "../service/pedidos.service";

import type {
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
} from "../types/pedido.types";

// Obtener pedidos paginados
export const usePedidos = (
    skip = 0,
    limit = 10,
    estado?: EstadoPedido,
) => {
    return useQuery({
        queryKey: ["pedidos", skip, limit, estado],
        queryFn: () => obtenerPedidos(skip, limit, estado),
        placeholderData: (previousData) => previousData,
    });
};
// Obtener un pedido por ID
export const usePedido = (pedidoId: number) => {
    return useQuery({
        queryKey: ["pedido", pedidoId],
        queryFn: () => obtenerPedido(pedidoId),
        enabled: pedidoId > 0,
    });
};

// Obtener resumen administrativo
export const useResumenPedidos = () => {
    return useQuery({
        queryKey: ["resumen-pedidos"],
        queryFn: obtenerResumenPedidos,
    });
};

// Crear un pedido
export const useCrearPedido = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (pedido: PedidoCreate) => crearPedido(pedido),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["pedidos"],
            });

            queryClient.invalidateQueries({
                queryKey: ["resumen-pedidos"],
            });
        },
    });
};

// Actualizar estado de un pedido
export const useActualizarEstadoPedido = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            pedidoId,
            data,
        }: {
            pedidoId: number;
            data: CambioEstado;
        }) => actualizarEstadoPedido(pedidoId, data),

        onSuccess: (pedidoActualizado) => {
            queryClient.invalidateQueries({
                queryKey: ["pedidos"],
            });

            queryClient.invalidateQueries({
                queryKey: ["pedido", pedidoActualizado.id],
            });

            queryClient.invalidateQueries({
                queryKey: ["resumen-pedidos"],
            });
        },
    });
};