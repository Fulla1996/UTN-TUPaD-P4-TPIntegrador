import type { CategoriaPublic } from "../types/categoria.types";

import { Card } from "@/shared/";

interface CategoriaCardProps {
    categoria: CategoriaPublic;
    onEditar: (categoria: CategoriaPublic) => void;
    onEliminar: (id: number) => void;
}

function CategoriaCard({
    categoria,
    onEditar,
    onEliminar,
}: CategoriaCardProps) {
    return (
        <Card
            title={categoria.nombre}
            description={categoria.descripcion || "Sin descripción"}
            footer={
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onEditar(categoria)}
                        className="btn btn-warning"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={() => onEliminar(categoria.id)}
                        className="btn btn-danger"
                    >
                        Eliminar
                    </button>
                </div>
            }
        />
    );
}

export default CategoriaCard;