import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    obtenerUsuarios,
    activarUsuario,
    desactivarUsuario,
} from "../../usuarios/services/usuarios.service";

import { useNotificationStore } from "@/store/notificationStore";

export function useUsuarios() {
    const showNotification = useNotificationStore(
        (state) => state.showNotification
    );

    const queryClient = useQueryClient();

    // Obtener usuarios
    const usuariosQuery = useQuery({
        queryKey: ["usuarios"],
        queryFn: obtenerUsuarios,
    });

    // Activar usuario
    const activarMutation = useMutation({
        mutationFn: activarUsuario,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["usuarios"],
            });
            showNotification("Usuario activado correctamente")
        },
    });

    // Desactivar usuario
    const desactivarMutation = useMutation({
        mutationFn: desactivarUsuario,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["usuarios"],
            });
            showNotification("Usuario desactivado correctamente")
        },
    });

    return {
        usuariosQuery,
        activarMutation,
        desactivarMutation,
    };
}