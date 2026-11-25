import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import type {
    CategoriaUpdate,
} from "../types/categoria.types";

import {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
} from "../services/categoria.service";

import { useNotificationStore } from "@/store/notificationStore";

export function useCategorias() {
    const showNotification = useNotificationStore(
        (state) => state.showNotification,
    );

    const queryClient = useQueryClient();

    // Obtener categorías
    const categoriasQuery = useQuery({
        queryKey: ["categorias"],
        queryFn: obtenerCategorias,
    });

    // Crear categoría
    const crearMutation = useMutation({
        mutationFn: crearCategoria,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["categorias"],
            });
            showNotification("Categoría creada correctamente");
        },
    });

    // Actualizar categoría
    const editarMutation = useMutation({
        mutationFn: ({
            id,
            categoria,
        }: {
            id: number;
            categoria: CategoriaUpdate;
        }) => actualizarCategoria(id, categoria),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["categorias"],
            });
            showNotification("Categoría modificada correctamente");
        },
    });

    // Eliminar categoría
    const eliminarMutation = useMutation({
        mutationFn: eliminarCategoria,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["categorias"],
            });
            showNotification("Categoría eliminada correctamente");
        },
    });

    return {
        categoriasQuery,
        crearMutation,
        editarMutation,
        eliminarMutation,
    };
}