import { api } from "@/shared/api/api";

import type {
  IngredienteCreate,
  IngredientePublic,
} from "../types/ingrediente.types";

export const obtenerIngredientes = async (): Promise<IngredientePublic[]> => {
  const response = await api.get<IngredientePublic[]>("/ingredientes/", {
    params: { limit: 50 }
  });

  return response.data;

};

export const crearIngrediente = async (
  ingrediente: IngredienteCreate
): Promise<IngredientePublic> => {
  const response = await api.post<IngredientePublic>(
    "/ingredientes/",
    ingrediente
  );

  return response.data;
}

export const actualizarIngrediente = async (
  id: number,
  ingrediente: IngredienteCreate
): Promise<IngredientePublic> => {
  const response = await api.put<IngredientePublic>(
    `/ingredientes/${id}`,
    ingrediente
  );

  return response.data;
};

export const eliminarIngrediente = async (id: number): Promise<void> => {
  await api.delete(`/ingredientes/${id}`);
};