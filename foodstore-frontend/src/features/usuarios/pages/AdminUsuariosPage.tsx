import { useUsuarios } from "@/features/usuarios";

import UsuarioList from "../components/UsuarioList";

import LoadingState from "@/shared/components/LoadingState";
import EmptyState from "@/shared/components/EmptyState";
import ErrorState from "@/shared/components/ErrorState";

function AdminUsuariosPage() {
    const {
        usuariosQuery,
        activarMutation,
        desactivarMutation,
    } = useUsuarios();

    const mutacionPendiente =
        activarMutation.isPending || desactivarMutation.isPending;

    const handleActivar = (id: number) => {
        const confirmar = window.confirm(
            "¿Estás seguro de que deseas activar este usuario?"
        );

        if (confirmar) {
            activarMutation.mutate(id);
        }
    };

    const handleDesactivar = (id: number) => {
        const confirmar = window.confirm(
            "¿Estás seguro de que deseas desactivar este usuario?"
        );

        if (confirmar) {
            desactivarMutation.mutate(id);
        }
    };

    // Estado de carga
    if (usuariosQuery.isLoading) {
        return <LoadingState mensaje="Cargando usuarios..." />;
    }

    // Error al recuperar usuarios
    if (usuariosQuery.isError) {
        return (
            <ErrorState
                mensaje={`Error al recuperar los usuarios: ${usuariosQuery.error.message}`}
                onReintentar={() => usuariosQuery.refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">
                Administración de usuarios
            </h1>

            {/* Error al activar */}
            {activarMutation.isError && (
                <p className="rounded-lg border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                    Error al activar el usuario:{" "}
                    {activarMutation.error.message}
                </p>
            )}

            {/* Error al desactivar */}
            {desactivarMutation.isError && (
                <p className="rounded-lg border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                    Error al desactivar el usuario:{" "}
                    {desactivarMutation.error.message}
                </p>
            )}

            {/* Listado */}
            {usuariosQuery.data && usuariosQuery.data.length > 0 ? (
                <UsuarioList
                    usuarios={usuariosQuery.data}
                    onActivar={handleActivar}
                    onDesactivar={handleDesactivar}
                />
            ) : (
                <EmptyState mensaje="No hay usuarios registrados." />
            )}
        </div>
    );
}

export default AdminUsuariosPage;