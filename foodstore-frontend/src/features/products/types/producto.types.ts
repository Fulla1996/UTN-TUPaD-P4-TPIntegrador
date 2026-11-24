import type { CategoriaPublic } from "@/features/categories"
import type { UnidadMedida } from "./unidad_medida.types"

export interface ProductoCreate{
    nombre: string
    descripcion?: string | null
    precio_base: string
    stock_cantidad?: string
    disponible?: boolean
    imagenes_url?: string[]
    unidad_venta_id: number
}

export interface ProductoUpdate extends ProductoCreate{
}

export interface ProductoPublic{
    id: number
    nombre: string
    descripcion?: string | null
    precio_base: string
    stock_cantidad: string
    unidad_venta: UnidadMedida
    disponible: boolean
    imagenes_url: string[]
    anulado_at: string | null
    activo: boolean
    categorias: CategoriaPublic[]
    hay_stock: boolean
}