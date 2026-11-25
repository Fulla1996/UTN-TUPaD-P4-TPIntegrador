import { api } from "@/shared/api/axiosInstance";

import type {
  ProductoCreate,
  ProductoPublic,
  ProductoUpdate,
  ProductosResponse,
} from "../types/producto.types";

// Obtener productos paginados
export const obtenerProductos = async (): Promise<ProductosResponse> => {
  const response = await api.get<ProductosResponse>("/productos/", {
    params: { limit: 50 },
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