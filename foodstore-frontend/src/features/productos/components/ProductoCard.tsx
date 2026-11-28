import type { ProductoPublic } from "@/features/productos";

import { Link } from "react-router-dom";

import { Card, BadgeEstado } from "@/shared";
import { useCartStore } from "@/store/cartStore";
import { useNotificationStore } from "@/store/notificationStore";

interface ProductoCardProps {
    producto: ProductoPublic;
    modo?: "publico" | "admin";
    onClick?: () => void;
    onEditar?: (producto: ProductoPublic) => void;
    onCambiarDisponibilidad?: (producto: ProductoPublic) => void;
    onAnular?: (id: number) => void;
    enlaceDetalle?: boolean
}

export const ProductoCard = ({
    producto,
    modo = "publico",
    onEditar,
    onCambiarDisponibilidad,
    onAnular,
    enlaceDetalle = true
}: ProductoCardProps) => {
    const agregarProducto = useCartStore((state) => state.agregarProducto);

    const showNotification = useNotificationStore(
        (state) => state.showNotification
    );

    const estado = !producto.activo
        ? { texto: "Inactivo", variante: "neutral" as const }
        : !producto.stock
            ? { texto: "Sin stock", variante: "warning" as const }
            : !producto.disponible
                ? { texto: "No disponible", variante: "danger" as const }
                : { texto: "Disponible", variante: "success" as const };

    const puedeAgregar =
        producto.activo &&
        producto.disponible &&
        producto.stock > 0;

    const handleAgregarCarrito = () => {
        if (!puedeAgregar) return;

        agregarProducto(producto);
        showNotification(`${producto.nombre} agregado al carrito`);
    };

    return (
        <Card className="rounded-xl p-5 transition-shadow hover:shadow-md">
            {modo === "publico" && enlaceDetalle ? (
                <Link
                    to={`/productos/${producto.id}`}
                    className="block rounded-md focus-visible:outline-2 focus-visible:outline-primary"
                >
                    <ContenidoProducto
                        producto={producto}
                        estado={estado}
                        mostrarEstado={
                            !producto.activo ||
                            !producto.disponible ||
                            producto.stock <= 0
                        }
                    />
                </Link>
            ) : (
                <ContenidoProducto
                    producto={producto}
                    estado={estado}
                    mostrarEstado={
                        !producto.activo ||
                        !producto.disponible ||
                        producto.stock <= 0
                    }
                />
            )}

            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                {modo === "publico" && (
                    <button
                        type="button"
                        onClick={handleAgregarCarrito}
                        disabled={!puedeAgregar}
                        className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {puedeAgregar
                            ? "Agregar al carrito"
                            : "No disponible"}
                    </button>
                )}

                {modo === "admin" && (
                    <>
                        <button
                            type="button"
                            onClick={() => onEditar?.(producto)}
                            disabled={!producto.activo}
                            className="btn btn-warning"
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            onClick={() => onCambiarDisponibilidad?.(producto)}
                            disabled={!producto.activo}
                            className="btn btn-secondary"
                        >
                            {producto.disponible
                                ? "Deshabilitar"
                                : "Habilitar"}
                        </button>

                        <button
                            type="button"
                            onClick={() => onAnular?.(producto.id)}
                            disabled={!producto.activo}
                            className="btn btn-soft-danger"
                        >
                            Anular
                        </button>
                    </>
                )}
            </div>
        </Card>
    );
};

interface ContenidoProductoProps {
    producto: ProductoPublic;
    estado: {
        texto: string;
        variante: "success" | "warning" | "danger" | "info" | "neutral";
    };
    mostrarEstado: boolean;
}

function ContenidoProducto({
    producto,
    estado,
    mostrarEstado,
}: ContenidoProductoProps) {
    return (
        <>
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        {producto.nombre}
                    </h2>

                    <p className="text-sm text-muted">
                        {producto.descripcion || "Sin descripción"}
                    </p>
                </div>

                {mostrarEstado && (
                    <BadgeEstado
                        texto={estado.texto}
                        variante={estado.variante}
                    />
                )}
            </div>

            {producto.imagen_url && (
                <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                />
            )}

            <div className="space-y-2">
                <p className="text-sm text-muted">
                    <span className="font-medium text-foreground">
                        Precio:
                    </span>{" "}
                    ${Number(producto.precio_base).toFixed(2)}
                </p>

                <p className="text-sm text-muted">
                    Stock: {producto.stock > 0
                        ? `${producto.stock} unidades disponibles`
                        : "Sin stock"}
                </p>

                <div className="pt-1">
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {producto.categoria.nombre}
                    </span>
                </div>
            </div>
        </>
    );
}

export default ProductoCard;