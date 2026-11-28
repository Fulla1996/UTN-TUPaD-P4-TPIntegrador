import type { CartItem } from "@/store/cartStore";

interface CarritoItemProps {
    item: CartItem;
    modo: "editable" | "lectura";
    onActualizarCantidad?: (productoId: number, cantidad: number) => void;
    onQuitarProducto?: (productoId: number) => void;
    disabled?: boolean;
}

const CarritoItem = ({
    item,
    modo,
    onActualizarCantidad,
    onQuitarProducto,
    disabled = false,
}: CarritoItemProps) => {
    const { producto, cantidad } = item;

    const precio = Number(producto.precio_base);
    const subtotal = precio * cantidad;

    return (
        <article className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm sm:flex-row">
            {producto.imagen_url ? (
                <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="h-32 w-full rounded-lg object-cover sm:w-32"
                />
            ) : (
                <div className="flex h-32 w-full items-center justify-center rounded-lg bg-background text-sm text-muted sm:w-32">
                    Sin imagen
                </div>
            )}

            <div className="flex flex-1 flex-col justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        {producto.nombre}
                    </h2>

                    <p className="text-sm text-muted">
                        {producto.categoria.nombre}
                    </p>

                    <p className="mt-1 font-medium text-foreground">
                        ${precio.toFixed(2)}
                    </p>

                    {modo === "editable" && (
                        producto.stock > 0 ? (
                            <p className="mt-1 text-sm text-muted">
                                Stock disponible: {producto.stock}
                            </p>
                        ) : (
                            <p className="mt-2 text-sm font-semibold text-red-600">
                                Producto no disponible
                            </p>
                        )
                    )}
                </div>

                {modo === "editable" ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {producto.stock > 0 ? (
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        onActualizarCantidad?.(
                                            producto.id,
                                            cantidad - 1,
                                        )
                                    }
                                    disabled={disabled}
                                    className="btn btn-secondary"
                                    aria-label={`Disminuir cantidad de ${producto.nombre}`}
                                >
                                    -
                                </button>

                                <span className="min-w-6 text-center font-medium">
                                    {cantidad}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onActualizarCantidad?.(
                                            producto.id,
                                            cantidad + 1,
                                        )
                                    }
                                    disabled={
                                        disabled ||
                                        cantidad >= producto.stock
                                    }
                                    className="btn btn-secondary"
                                    aria-label={`Aumentar cantidad de ${producto.nombre}`}
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <span className="text-sm font-medium text-red-600">
                                Eliminá este producto para continuar.
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                onQuitarProducto?.(producto.id)
                            }
                            disabled={disabled}
                            className="text-sm font-medium text-red-600 hover:underline"
                        >
                            Eliminar
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-muted">
                        Cantidad: {cantidad}
                    </p>
                )}
            </div>

            <div className="text-right sm:min-w-28">
                <p className="text-sm text-muted">
                    Subtotal
                </p>

                <p className="font-semibold text-foreground">
                    ${subtotal.toFixed(2)}
                </p>
            </div>
        </article>
    );
};

export default CarritoItem;