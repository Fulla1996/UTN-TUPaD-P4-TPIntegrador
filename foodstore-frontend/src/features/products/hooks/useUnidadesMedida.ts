import { useQuery } from "@tanstack/react-query";

import { obtenerUnidades } from "../services/unidad_medida.service";

export function useUnidadesMedida() {
    return useQuery({
        queryKey: ["unidades-medida"],
        queryFn: obtenerUnidades,
    });
}