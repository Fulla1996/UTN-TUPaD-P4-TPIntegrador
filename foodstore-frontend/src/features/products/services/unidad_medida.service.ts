import { api } from "@/shared/api/api";

import type { UnidadMedida } from "../types/unidad_medida.types";

export const obtenerUnidades = async (): Promise<UnidadMedida[]> => {
  const response = await api.get<UnidadMedida[]>(
    "/unidades-medida/"
  );

  return response.data;
};