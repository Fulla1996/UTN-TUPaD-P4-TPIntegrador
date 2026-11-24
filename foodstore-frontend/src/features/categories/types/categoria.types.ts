export interface CategoriaCreate{
    nombre: string
    descripcion?: string | null
}

export interface CategoriaPublic{
    id: number
    nombre: string
    descripcion?: string | null
    activo: boolean
    anulado_at?: string | null
}