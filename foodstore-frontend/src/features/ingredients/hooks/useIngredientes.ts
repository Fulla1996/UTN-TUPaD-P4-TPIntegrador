import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
    IngredienteCreate,
} from "../types/ingrediente.types";

import {
    obtenerIngredientes,
    crearIngrediente,
    actualizarIngrediente,
    eliminarIngrediente,
} from "../services/ingrediente.service";

import { useNotificationStore } from "@/store/notificationStore";

export function useIngredientes() {
    const showNotification = useNotificationStore(
        (state) => state.showNotification
    );

    const queryClient = useQueryClient();

    //Obtener ingredientes
    const ingredientesQuery = useQuery({
        queryKey: ["ingredientes"],
        queryFn: obtenerIngredientes,
    });


    const crearMutation = useMutation({
        mutationFn: crearIngrediente,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["ingredientes"],
            });
            showNotification("Ingrediente creado correctamente")
        },
    });

    const editarMutation = useMutation({
        mutationFn: ({
            id,
            ingrediente,
        }: {
            id: number;
            ingrediente: IngredienteCreate;
        }) => actualizarIngrediente(id, ingrediente),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["ingredientes"],
            });
            showNotification("Ingrediente modificado correctamente")
        },
    });

    const eliminarMutation = useMutation({
        mutationFn: eliminarIngrediente,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["ingredientes"],
            });
            showNotification("Ingrediente eliminado correctamente")
        },
    });

    return {
        ingredientesQuery,
        crearMutation,
        editarMutation,
        eliminarMutation
    };
}