interface PaginationProps {
    paginaActual: number;
    totalPaginas: number;
    onCambiarPagina: (pagina: number) => void;
    limite: number;
    onCambiarLimite: (limite: number) => void;
}

const Pagination = ({
    paginaActual,
    totalPaginas,
    onCambiarPagina,
    limite,
    onCambiarLimite,
}: PaginationProps) => {
    if (totalPaginas <= 0) return null;

    return (
        <nav
            aria-label="Paginación"
            className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
        >
            {/* Selector de cantidad */}
            <div className="flex items-center gap-2">
                <label
                    htmlFor="pagination-limit"
                    className="text-sm text-muted"
                >
                    Mostrar:
                </label>

                <select
                    id="pagination-limit"
                    value={limite}
                    onChange={(event) =>
                        onCambiarLimite(Number(event.target.value))
                    }
                    className="form-input w-auto"
                >
                    {[5, 10, 15, 20, 50].map((cantidad) => (
                        <option key={cantidad} value={cantidad}>
                            {cantidad}
                        </option>
                    ))}
                </select>

                <span className="text-sm text-muted">
                    por página
                </span>
            </div>

            {/* Navegación */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={paginaActual <= 1}
                    onClick={() => onCambiarPagina(paginaActual - 1)}
                    className="btn btn-secondary"
                >
                    Anterior
                </button>

                <span className="text-sm text-foreground">
                    Página {paginaActual} de {totalPaginas}
                </span>

                <button
                    type="button"
                    disabled={paginaActual >= totalPaginas}
                    onClick={() => onCambiarPagina(paginaActual + 1)}
                    className="btn btn-secondary"
                >
                    Siguiente
                </button>
            </div>
        </nav>
    );
};

export default Pagination;