import type { CategoriaPublic } from "@/features/categorias";

export interface ProductoCreate {
  categoria_id: number;
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
  imagen_url?: string | null;
  stock?: number;
  disponible?: boolean;
}

export interface ProductoUpdate {
  categoria_id?: number;
  nombre?: string;
  descripcion?: string | null;
  precio_base?: number;
  imagen_url?: string | null;
  stock?: number;
  disponible?: boolean;
}

export interface ProductoPublic {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  activo: boolean;
  categoria: CategoriaPublic;
}

export interface ProductosResponse {
  total: number;
  items: ProductoPublic[];
}

export type ProductoSortBy =
    | "id"
    | "nombre"
    | "precio_base"
    | "stock"
    | "descripcion"
    | "disponible"
    | "activo";

export type SortOrder = "asc" | "desc";