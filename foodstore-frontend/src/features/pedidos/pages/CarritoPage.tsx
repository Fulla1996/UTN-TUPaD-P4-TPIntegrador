import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

const CarritoPage = () => {
    const usuarioId = useAuthStore((state) => state.user!.id);

    const items = useCartStore(
        (state) => state.carts[usuarioId] ?? [],
    );

    const actualizarCantidad = useCartStore(
        (state) => state.actualizarCantidad,
    );

    const quitarProducto = useCartStore(
        (state) => state.quitarProducto,
    );

    const vaciarCarrito = useCartStore(
        (state) => state.vaciarCarrito,
    );

    const sincronizarCarrito = useCartStore(
        (state) => state.sincronizarCarrito,
    );

    const [sincronizando, setSincronizando] = useState(true);
    const [errorSincronizacion, setErrorSincronizacion] = useState(false);
    const [precioCambio, setPrecioCambio] = useState(false);
    const [stockCambio, setStockCambio] = useState(false);
    const [mensajeCheckout, setMensajeCheckout] = useState("");

    // Sincronizar productos al ingresar al carrito.
    useEffect(() => {
        const sincronizar = async () => {
            try {
                setSincronizando(true);
                setErrorSincronizacion(false);

                const resultado = await sincronizarCarrito();

                setPrecioCambio(resultado.precioCambio);
                setStockCambio(resultado.stockCambio);
            } catch {
                setErrorSincronizacion(true);
            } finally {
                setSincronizando(false);
            }
        };

        void sincronizar();
    }, [sincronizarCarrito]);

    const total = items.reduce(
        (acumulado, item) =>
            acumulado +
            Number(item.producto.precio_base) * item.cantidad,
        0,
    );

    const cantidadTotal = items.reduce(
        (acumulado, item) => acumulado + item.cantidad,
        0,
    );

    const hayProductosNoDisponibles = items.some(
        (item) => item.producto.stock <= 0,
    );

    // Volver a verificar los productos antes de continuar.
    const handleContinuarCompra = async () => {
        try {
            setSincronizando(true);
            setErrorSincronizacion(false);
            setMensajeCheckout("");

            const resultado = await sincronizarCarrito();

            setPrecioCambio(resultado.precioCambio);
            setStockCambio(resultado.stockCambio);

            if (resultado.precioCambio || resultado.stockCambio) {
                setMensajeCheckout(
                    "Se detectaron cambios en los productos. Revisá los precios y las cantidades actualizadas antes de continuar.",
                );

                return;
            }

            setMensajeCheckout(
                "Los productos y sus precios están actualizados. El proceso de compra estará disponible próximamente.",
            );
        } catch {
            setErrorSincronizacion(true);
        } finally {
            setSincronizando(false);
        }
    };

    if (sincronizando) {
        return (
            <main className="container mx-auto px-4 py-12">
                <div className="text-center text-muted">
                    Actualizando carrito...
                </div>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="container mx-auto px-4 py-12">
                <div className="mx-auto max-w-lg rounded-xl border border-border bg-surface p-8 text-center">
                    <h1 className="text-2xl font-bold text-foreground">
                        Tu carrito está vacío
                    </h1>

                    <p className="mt-3 text-muted">
                        Todavía no agregaste productos a tu carrito.
                    </p>

                    <Link
                        to="/"
                        className="btn btn-primary mt-6 inline-flex"
                    >
                        Ver catálogo
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Mi carrito
                    </h1>

                    <p className="mt-2 text-muted">
                        {cantidadTotal} producto(s) en tu carrito.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={vaciarCarrito}
                    disabled={sincronizando}
                    className="btn btn-soft-danger"
                >
                    Vaciar carrito
                </button>
            </header>

            {/* Mensajes de sincronización */}
            {errorSincronizacion && (
                <div
                    role="alert"
                    className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800"
                >
                    No fue posible actualizar los productos del carrito.
                    Verificá tu conexión e intentá nuevamente.
                </div>
            )}

            {!errorSincronizacion && precioCambio && (
                <div
                    role="alert"
                    className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
                >
                    Algunos productos modificaron su precio. Revisá los
                    nuevos importes antes de continuar.
                </div>
            )}

            {!errorSincronizacion && stockCambio && (
                <div
                    role="alert"
                    className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
                >
                    Se modificó el stock de algunos productos. Las cantidades
                    fueron ajustadas según la disponibilidad actual.
                </div>
            )}

            {mensajeCheckout && (
                <div
                    role="status"
                    className="mb-6 rounded-lg border border-blue-300 bg-blue-50 p-4 text-sm text-blue-900"
                >
                    {mensajeCheckout}
                </div>
            )}

            {sincronizando && (
                <div
                    role="status"
                    className="mb-6 text-sm text-muted"
                >
                    Actualizando productos...
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <section
                    aria-label="Productos del carrito"
                    className="space-y-4 lg:col-span-2"
                >
                    {items.map(({ producto, cantidad }) => (
                        <article
                            key={producto.id}
                            className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm sm:flex-row"
                        >
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
                                        ${Number(producto.precio_base).toFixed(2)}
                                    </p>

                                    {producto.stock > 0 ? (
                                        <p className="mt-1 text-sm text-muted">
                                            Stock disponible: {producto.stock}
                                        </p>
                                    ) : (
                                        <p className="mt-2 text-sm font-semibold text-red-600">
                                            Producto no disponible
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    {producto.stock > 0 ? (
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    actualizarCantidad(
                                                        producto.id,
                                                        cantidad - 1,
                                                    )
                                                }
                                                disabled={sincronizando}
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
                                                    actualizarCantidad(
                                                        producto.id,
                                                        cantidad + 1,
                                                    )
                                                }
                                                disabled={
                                                    sincronizando ||
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
                                            quitarProducto(producto.id)
                                        }
                                        disabled={sincronizando}
                                        className="text-sm font-medium text-red-600 hover:underline"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className="text-right sm:min-w-28">
                                <p className="text-sm text-muted">
                                    Subtotal
                                </p>

                                <p className="font-semibold text-foreground">
                                    $
                                    {(
                                        Number(producto.precio_base) * cantidad
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </article>
                    ))}
                </section>

                <aside className="h-fit rounded-xl border border-border bg-surface p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-foreground">
                        Resumen del pedido
                    </h2>

                    <div className="mt-6 flex justify-between text-sm text-muted">
                        <span>Productos</span>
                        <span>{cantidadTotal}</span>
                    </div>

                    <div className="mt-4 flex justify-between border-t border-border pt-4">
                        <span className="font-semibold text-foreground">
                            Total
                        </span>

                        <span className="text-xl font-bold text-foreground">
                            ${total.toFixed(2)}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleContinuarCompra}
                        disabled={
                            sincronizando ||
                            errorSincronizacion ||
                            hayProductosNoDisponibles
                        }
                        className="btn btn-primary mt-6 w-full"
                    >
                        {sincronizando
                            ? "Verificando productos..."
                            : "Continuar con la compra"}
                    </button>

                    {hayProductosNoDisponibles && (
                        <p className="mt-3 text-center text-xs text-red-600">
                            Eliminá los productos no disponibles para
                            continuar.
                        </p>
                    )}

                    <Link
                        to="/"
                        className="mt-4 block text-center text-sm text-muted hover:underline"
                    >
                        Seguir comprando
                    </Link>
                </aside>
            </div>
        </main>
    );
};

export default CarritoPage;