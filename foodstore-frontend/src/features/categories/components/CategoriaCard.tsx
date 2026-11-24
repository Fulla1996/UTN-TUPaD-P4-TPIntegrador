import type { CategoriaPublic } from "../types/categoria.types";

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
    <article className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">
        {categoria.nombre}
      </h3>

      <p className="mt-2 text-sm text-muted">
        {categoria.descripcion || "Sin descripción"}
      </p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEditar(categoria)}
          className="btn btn-warning"
        >
          Editar
        </button>

        <button
          onClick={() => onEliminar(categoria.id)}
          className="btn btn-danger"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default CategoriaCard;