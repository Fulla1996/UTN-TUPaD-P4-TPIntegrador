import { api } from "@/shared/api/axiosInstance";

import type {
  ProductoCreate,
  ProductoPublic,
  ProductoSortBy,
  ProductoUpdate,
  ProductosResponse,
  SortOrder,
} from "../types/producto.types";
interface ObtenerProductosParams {
  search?: string;
  categoria_id?: number | null;
  skip?: number;
  limit?: number;
  activo?: boolean;
  disponible?: boolean;
  sort_by?: ProductoSortBy;
  sort_order?: SortOrder;
}

// Obtener productos paginados
export const obtenerProductos = async ({
  search = "",
  categoria_id,
  skip = 0,
  limit = 10,
  activo,
  disponible,
  sort_by = "nombre",
  sort_order = "asc",
}: ObtenerProductosParams): Promise<ProductosResponse> => {
  const response = await api.get<ProductosResponse>("/productos/", {
    params: {
      skip,
      limit,
      search,
      categoria_id: categoria_id ?? undefined,
      activo,
      disponible,
      sort_by,
      sort_order,
    },
  });

  return response.data;
};

// Obtener un producto por ID
export const obtenerProducto = async (
  id: number,
): Promise<ProductoPublic> => {
  const response = await api.get<ProductoPublic>(`/productos/${id}`);

  return response.data;
};

// Crear producto
export const crearProducto = async (
  producto: ProductoCreate,
): Promise<ProductoPublic> => {
  const response = await api.post<ProductoPublic>("/productos/", producto);

  return response.data;
};

// Actualizar producto
export const actualizarProducto = async (
  id: number,
  producto: ProductoUpdate,
): Promise<ProductoPublic> => {
  const response = await api.patch<ProductoPublic>(
    `/productos/${id}`,
    producto,
  );

  return response.data;
};

// Eliminar producto
export const eliminarProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`);
};