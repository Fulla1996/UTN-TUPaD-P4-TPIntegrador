import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

import { useCrearPedido } from "@/features/pedidos/hooks/usePedidos";
import type { PedidoCreate } from "@/features/pedidos/types/pedido.types";

import CarritoList from "@/features/pedidos/components/CarritoList";
import CheckoutPage from "@/features/pedidos/pages/CheckoutPage";

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

    const crearMutation = useCrearPedido();

    const [sincronizando, setSincronizando] = useState(true);
    const [errorSincronizacion, setErrorSincronizacion] = useState(false);
    const [precioCambio, setPrecioCambio] = useState(false);
    const [stockCambio, setStockCambio] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

    const limpiarErrores = () => {
        crearMutation.reset();
    };

    const handleAbrirCheckout = async () => {
        try {
            setSincronizando(true);
            setErrorSincronizacion(false);
            limpiarErrores();

            const resultado = await sincronizarCarrito();

            setPrecioCambio(resultado.precioCambio);
            setStockCambio(resultado.stockCambio);

            if (resultado.precioCambio || resultado.stockCambio) {
                return;
            }

            setIsCheckoutOpen(true);
        } catch {
            setErrorSincronizacion(true);
        } finally {
            setSincronizando(false);
        }
    };

    const handleCerrarCheckout = () => {
        if (crearMutation.isPending) return;

        setIsCheckoutOpen(false);
        limpiarErrores();
    };

    const handleCrearPedido = (pedido: PedidoCreate) => {
        crearMutation.mutate(pedido, {
            onSuccess: () => {
                vaciarCarrito();
                limpiarErrores();
                setIsCheckoutOpen(false);
            },
        });
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

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <section
                    aria-label="Productos del carrito"
                    className="lg:col-span-2"
                >
                    <CarritoList
                        items={items}
                        modo="editable"
                        onActualizarCantidad={actualizarCantidad}
                        onQuitarProducto={quitarProducto}
                        disabled={sincronizando}
                    />
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
                        onClick={handleAbrirCheckout}
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

            <CheckoutPage
                isOpen={isCheckoutOpen}
                items={items}
                onClose={handleCerrarCheckout}
                onSubmit={handleCrearPedido}
                isPending={crearMutation.isPending}
                error={crearMutation.error?.message ?? null}
            />
        </main>
    );
};

export default CarritoPage;