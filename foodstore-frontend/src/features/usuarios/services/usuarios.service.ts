import { api } from "@/shared/api/axiosInstance";
import type { UsuarioAuth } from "@/features/usuarios";

// Obtener todos los usuarios
export const obtenerUsuarios = async (): Promise<UsuarioAuth[]> => {
    const response = await api.get<UsuarioAuth[]>(
        "/auth/admin/usuarios"
    );

    return response.data;
};

// Activar un usuario
export const activarUsuario = async (
    id: number
): Promise<UsuarioAuth> => {
    const response = await api.post<UsuarioAuth>(
        `/auth/admin/usuarios/${id}/activar`
    );

    return response.data;
};

// Desactivar un usuario
export const desactivarUsuario = async (
    id: number
): Promise<UsuarioAuth> => {
    const response = await api.post<UsuarioAuth>(
        `/auth/admin/usuarios/${id}/desactivar`
    );

    return response.data;
};