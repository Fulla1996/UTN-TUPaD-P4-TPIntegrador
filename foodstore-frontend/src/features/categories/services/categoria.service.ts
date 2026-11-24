import { api } from "@/shared/api/api";

import type {
  CategoriaCreate,
  CategoriaPublic,
} from "../types/categoria.types";

export const obtenerCategorias = async (): Promise<CategoriaPublic[]> => {
  const response = await api.get<CategoriaPublic[]>("/categorias/", {
    params: { limit: 50 },
  });

  return response.data;
};

export const crearCategoria = async (
  categoria: CategoriaCreate
): Promise<CategoriaPublic> => {
  const response = await api.post<CategoriaPublic>(
    "/categorias/",
    categoria
  );

  return response.data;
};

export const actualizarCategoria = async (
  id: number,
  categoria: CategoriaCreate
): Promise<CategoriaPublic> => {
  const response = await api.put<CategoriaPublic>(
    `/categorias/${id}`,
    categoria
  );

  return response.data;
};

export const eliminarCategoria = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`);
};