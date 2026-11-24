import { api } from "@/shared/api/api";
import type { UsuarioAdmin } from "../types/usuario.types";

// Obtener todos los usuarios
export const obtenerUsuarios = async (): Promise<UsuarioAdmin[]> => {
    const response = await api.get<UsuarioAdmin[]>(
        "/auth/admin/usuarios"
    );

    return response.data;
};

// Activar un usuario
export const activarUsuario = async (
    id: number
): Promise<UsuarioAdmin> => {
    const response = await api.post<UsuarioAdmin>(
        `/auth/admin/usuarios/${id}/activar`
    );

    return response.data;
};

// Desactivar un usuario
export const desactivarUsuario = async (
    id: number
): Promise<UsuarioAdmin> => {
    const response = await api.post<UsuarioAdmin>(
        `/auth/admin/usuarios/${id}/desactivar`
    );

    return response.data;
};