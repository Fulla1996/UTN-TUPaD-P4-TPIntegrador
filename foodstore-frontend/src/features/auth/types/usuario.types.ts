export type RolUsuario = "admin" | "user";

export interface UsuarioAuth {
    id: number;
    username: string;
    full_name: string;
    email: string;
    created_at: string;
    disabled: boolean;
    role: RolUsuario;
}