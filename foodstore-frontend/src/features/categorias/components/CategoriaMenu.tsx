import { useCategorias } from "@/features/categorias";

interface CategoriaMenuProps {
    categoriaId: number | null;
    onChangeCategoria: (categoriaId: number | null) => void;
}

function CategoriaMenu({
    categoriaId,
    onChangeCategoria,
}: CategoriaMenuProps) {
    const { categoriasQuery } = useCategorias();

    if (categoriasQuery.isLoading) {
        return (
            <p className="px-3 py-2 text-sm text-muted">
                Cargando categorías...
            </p>
        );
    }

    if (categoriasQuery.isError || !categoriasQuery.data) {
        return (
            <p className="px-3 py-2 text-sm text-muted">
                No se pudieron cargar las categorías.
            </p>
        );
    }

    const categoriasActivas = categoriasQuery.data.filter(
        (categoria) => categoria.activo
    );

    const opciones = [
        { id: null, nombre: "Todas" },
        ...categoriasActivas.map((categoria) => ({
            id: categoria.id,
            nombre: categoria.nombre,
        })),
    ];

    return (
        <nav
            aria-label="Filtrar productos por categoría"
            className="space-y-1"
        >
            {opciones.map((categoria) => {
                const seleccionada = categoriaId === categoria.id;

                return (
                    <button
                        key={categoria.id ?? "todas"}
                        type="button"
                        onClick={() => onChangeCategoria(categoria.id)}
                        aria-pressed={seleccionada}
                        className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                            seleccionada
                                ? "bg-primary text-white"
                                : "text-muted hover:bg-background hover:text-foreground"
                        }`}
                    >
                        {categoria.nombre}
                    </button>
                );
            })}
        </nav>
    );
}

export default CategoriaMenu;