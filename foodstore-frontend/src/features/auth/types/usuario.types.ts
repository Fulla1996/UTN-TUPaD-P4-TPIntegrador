export interface UsuarioAuth {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    celular: string | null;
    roles: string[];
}

export interface UsuarioAdmin extends UsuarioAuth {
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    activo: boolean;
}