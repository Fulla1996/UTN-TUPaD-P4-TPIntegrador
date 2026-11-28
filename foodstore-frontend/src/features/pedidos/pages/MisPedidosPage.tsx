import { useEffect, useState } from "react";

import { Paginacion } from "@/shared";
import { useAuthStore } from "@/store/authStore";

import { usePedidos } from "../hooks/usePedidos";
import type { EstadoPedido } from "../types/pedido.types";
import PedidoCard from "../components/PedidoCard";

const estados: { valor: EstadoPedido | "TODOS"; etiqueta: string }[] = [
    { valor: "TODOS", etiqueta: "Todos los pedidos" },
    { valor: "PENDIENTE", etiqueta: "Pendientes" },
    { valor: "EN_PREPARACION", etiqueta: "En preparación" },
    { valor: "ENTREGADO", etiqueta: "Entregados" },
    { valor: "CANCELADO", etiqueta: "Cancelados" },
];

function MisPedidosPage() {
    const usuario = useAuthStore((state) => state.user);

    const [paginaActual, setPaginaActual] = useState(1);
    const [limite, setLimite] = useState(10);

    const [estadoSeleccionado, setEstadoSeleccionado] = useState<
        EstadoPedido | "TODOS"
    >("TODOS");

    const skip = (paginaActual - 1) * limite;

    useEffect(() => {
        setPaginaActual(1);
    }, [estadoSeleccionado]);

    const { data, isPending, isError, refetch } = usePedidos(
        skip,
        limite,
        estadoSeleccionado === "TODOS"
            ? undefined
            : estadoSeleccionado,
    );

    if (!usuario) {
        return null;
    }

    const pedidos = data?.items ?? [];

    const totalPaginas = Math.ceil(
        (data?.total ?? 0) / limite,
    );

    return (
        <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
            <header>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                    {usuario.role === "user" ? "Mis pedidos" : "Pedidos"}
                </h1>

                <p className="mt-1 text-muted">
                    {usuario.role === "user"
                        ? "Consultá el estado y los detalles de tus compras."
                        : "Control de estado"}
                </p>
            </header>

            <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label htmlFor="filtro-estado" className="form-label">
                    Filtrar por estado
                </label>

                <select
                    id="filtro-estado"
                    value={estadoSeleccionado}
                    onChange={(event) =>
                        setEstadoSeleccionado(
                            event.target.value as EstadoPedido | "TODOS",
                        )
                    }
                    className="form-input w-full sm:max-w-xs"
                >
                    {estados.map((estado) => (
                        <option key={estado.valor} value={estado.valor}>
                            {estado.etiqueta}
                        </option>
                    ))}
                </select>
            </section>

            {isPending && (
                <div className="py-12 text-center text-muted">
                    Cargando tus pedidos...
                </div>
            )}

            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
                    No fue posible cargar tus pedidos.
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="ml-2 underline"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {!isPending && !isError && pedidos.length === 0 && (
                <div className="rounded-xl border border-border bg-surface px-4 py-12 text-center">
                    <h2 className="text-lg font-semibold text-foreground">
                        {data?.total === 0
                            ? estadoSeleccionado === "TODOS"
                                ? "Todavía no tenés pedidos"
                                : "No hay pedidos con este estado"
                            : "No se encontraron pedidos"}
                    </h2>

                    <p className="mt-2 text-sm text-muted">
                        {data?.total === 0
                            ? "Cuando realices una compra, vas a poder consultar su información desde aquí."
                            : "No hay pedidos para mostrar en esta página."}
                    </p>
                </div>
            )}

            {!isPending && !isError && pedidos.length > 0 && (
                <>
                    <p className="text-sm text-muted">
                        {data?.total}{" "}
                        {data?.total === 1
                            ? "pedido encontrado"
                            : "pedidos encontrados"}
                    </p>

                    <div className="space-y-4">
                        {pedidos.map((pedido) => (
                            <PedidoCard
                                key={pedido.id}
                                pedido={pedido}
                            />
                        ))}
                    </div>

                    <Paginacion
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        limite={limite}
                        onCambiarPagina={setPaginaActual}
                        onCambiarLimite={(nuevoLimite) => {
                            setLimite(nuevoLimite);
                            setPaginaActual(1);
                        }}
                    />
                </>
            )}
        </main>
    );
}

export default MisPedidosPage;