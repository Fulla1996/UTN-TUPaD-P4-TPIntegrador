import { useResumenPedidos } from "@/features/pedidos/hooks/usePedidos";

import DashboardCard from "../components/DashboardCard";

import {
    LoadingState,
    ErrorState,
} from "@/shared";

function AdminDashboardPage() {
    const {
        data: resumen,
        isLoading,
        isError,
        refetch,
    } = useResumenPedidos();

    if (isLoading) {
        return <LoadingState mensaje="Cargando Dashboard..." />;
    }

    if (isError || !resumen) {
        return (
            <ErrorState
                mensaje="No se pudo cargar el resumen del dashboard."
                onReintentar={() => refetch()}
            />
        );
    }

    const indicadores = [
        {
            titulo: "Pedidos pendientes",
            valor: resumen.pendientes,
            descripcion: "Pedidos esperando atención",
            icono: "⏳",
        },
        {
            titulo: "En preparación",
            valor: resumen.en_preparacion,
            descripcion: "Pedidos en proceso",
            icono: "📦",
        },
        {
            titulo: "Pedidos entregados",
            valor: resumen.entregados,
            descripcion: "Pedidos completados",
            icono: "✅",
        },
        {
            titulo: "Pedidos cancelados",
            valor: resumen.cancelados,
            descripcion: "Pedidos cancelados",
            icono: "❌",
        },
        {
            titulo: "Pedidos de hoy",
            valor: resumen.pedidos_hoy,
            descripcion: "Pedidos registrados durante el día",
            icono: "📅",
        },
        {
            titulo: "Ingresos entregados",
            valor: `$ ${Number(resumen.ingresos_entregados).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`,
            descripcion: "Total de pedidos entregados",
            icono: "💰",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted">
                    Resumen general de la actividad de Food Store.
                </p>
            </div>

            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {indicadores.map((indicador) => (
                    <DashboardCard
                        key={indicador.titulo}
                        {...indicador}
                    />
                ))}
            </section>
        </div>
    );
}

export default AdminDashboardPage;