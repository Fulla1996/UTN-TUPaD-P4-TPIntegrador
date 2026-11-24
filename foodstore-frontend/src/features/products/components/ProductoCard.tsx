import type { ProductoPublic } from "../types/producto.types";

interface ProductoCardProps {
    producto: ProductoPublic;
    onEditar: (producto: ProductoPublic) => void;
    onCambiarDisponibilidad: (producto: ProductoPublic) => void;
    onAnular: (id: number) => void;
}

export const ProductoCard = ({
    producto,
    onEditar,
    onCambiarDisponibilidad,
    onAnular
}: ProductoCardProps) => {

    const estado = !producto.activo
        ? {
            texto: "Inactivo",
            estilos: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        }
        : !producto.hay_stock
            ? {
                texto: "Sin stock",
                estilos: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
            }
            : !producto.disponible
                ? {
                    texto: "No disponible",
                    estilos: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                }
                : {
                    texto: "Disponible",
                    estilos: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                };

    return (
        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">

            <div className="mb-3 flex items-start justify-between gap-3">

                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        {producto.nombre}
                    </h2>

                    <p className="text-sm text-muted">
                        {producto.descripcion || "Sin descripción"}
                    </p>
                </div>

                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${estado.estilos}`}
                >
                    {estado.texto}
                </span>

            </div>

            <div className="space-y-2">

                <p className="text-sm text-muted">
                    <span className="font-medium text-foreground">
                        Precio:
                    </span>{" "}
                    ${Number(producto.precio_base).toFixed(2)}
                </p>

                <p className="text-sm text-muted">
                    <span className="font-medium text-foreground">
                        Stock:
                    </span>{" "}
                    {producto.unidad_venta.tipo === "contable"
                        ? Number(producto.stock_cantidad).toFixed(0)
                        : producto.stock_cantidad}{" "}
                    {producto.unidad_venta.simbolo}
                </p>

                <p className="text-sm text-muted">
                    <span className="font-medium text-foreground">
                        Unidad de venta:
                    </span>{" "}
                    {producto.unidad_venta.nombre}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                    {producto.categorias.map(categoria => (
                        <span
                            key={categoria.id}
                            className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        >
                            {categoria.nombre}
                        </span>
                    ))}
                </div>

            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">

                <button
                    onClick={() => onEditar(producto)}
                    disabled={!producto.activo}
                    className="btn btn-warning"
                >
                    Editar
                </button>

                <button
                    onClick={() => onCambiarDisponibilidad(producto)}
                    disabled={!producto.activo}
                    className="btn btn-secondary"
                >
                    {producto.disponible
                        ? "Deshabilitar"
                        : "Habilitar"}
                </button>

                <button
                    onClick={() => onAnular(producto.id)}
                    disabled={!producto.activo}
                    className="btn btn-soft-danger"
                >
                    Anular
                </button>

            </div>

        </article>
    );
};

export default ProductoCard;