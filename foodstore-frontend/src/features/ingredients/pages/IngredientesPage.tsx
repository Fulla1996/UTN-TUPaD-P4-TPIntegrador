import { useState } from "react";

import type {
    IngredienteCreate,
    IngredientePublic,
} from "../types/ingrediente.types";


import { useIngredientes } from "../hooks/useIngredientes";

import IngredienteList from "../components/IngredienteList";
import IngredienteModal from "../components/IngredienteModal";

import { useAuthStore } from "@/features/auth";
import {
    ErrorState,
    LoadingState,
    EmptyState,
} from "@/shared/components";

function IngredientesPage() {

    const {
        ingredientesQuery,
        crearMutation,
        editarMutation,
        eliminarMutation,
    } = useIngredientes();

    const user = useAuthStore((state) => state.user);
    const esAdmin = user?.roles.includes("admin") ?? false;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ingredienteSeleccionado, setIngredienteSeleccionado] =
        useState<IngredientePublic | null>(null);

    const handleCerrarModal = () => {
        setIsModalOpen(false);
        setIngredienteSeleccionado(null);
    };

    const errorFormulario =
        crearMutation.error ??
        editarMutation.error;

    const limpiarErrores = () => {
        crearMutation.reset();
        editarMutation.reset();
        eliminarMutation.reset();
    };

    const handleNuevoIngrediente = () => {
        limpiarErrores();
        setIngredienteSeleccionado(null);
        setIsModalOpen(true);
    };

    const handleEditarIngrediente = (ingrediente: IngredientePublic) => {
        limpiarErrores();
        setIngredienteSeleccionado(ingrediente);
        setIsModalOpen(true);
    };

    const handleGuardarIngrediente = (ingrediente: IngredienteCreate) => {
        if (ingredienteSeleccionado) {
            editarMutation.mutate(
                {
                    id: ingredienteSeleccionado.id,
                    ingrediente,
                },
                {
                    onSuccess: () => {
                        limpiarErrores();
                        handleCerrarModal();
                    }
                });
        } else {
            crearMutation.mutate(
                ingrediente,
                {
                    onSuccess: () => {
                        limpiarErrores();
                        handleCerrarModal();
                    }
                }
            );
        }
    };

    const handleEliminarIngrediente = (id: number) => {
        if (eliminarMutation.isPending) return;

        const confirmar = window.confirm(
            "¿Estás seguro de que deseas eliminar este ingrediente?"
        );

        if (confirmar) {
            eliminarMutation.mutate(id);
        }
    };

    if (ingredientesQuery.isLoading) {
        return <LoadingState mensaje="Cargando ingredientes..." />;
    }

    if (ingredientesQuery.isError) {
        return (
            <ErrorState
                mensaje={`Error al cargar los ingredientes: ${ingredientesQuery.error.message}`}
                onReintentar={() => ingredientesQuery.refetch()}
            />
        );
    }

    return (
        <main className="container mx-auto min-h-screen bg-background px-4 py-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                    Gestión de Ingredientes
                </h1>

                {esAdmin && (
                    <button
                        onClick={handleNuevoIngrediente}
                        className="btn btn-primary"
                    >
                        Nuevo ingrediente
                    </button>
                )}
            </div>

            {eliminarMutation.error && (
                <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                    {eliminarMutation.error.message}
                </div>
            )}

            {ingredientesQuery.data && ingredientesQuery.data.length === 0 ? (
                <EmptyState mensaje="Todavía no hay ingredientes registrados." />
            ) : (
                <IngredienteList
                    ingredientes={ingredientesQuery.data ?? []}
                    onEditar={handleEditarIngrediente}
                    onEliminar={handleEliminarIngrediente}
                />
            )}

            <IngredienteModal
                isOpen={isModalOpen}
                ingrediente={ingredienteSeleccionado}
                onClose={handleCerrarModal}
                onSubmit={handleGuardarIngrediente}
                isPending={
                    crearMutation.isPending ||
                    editarMutation.isPending
                }
                error={errorFormulario?.message ?? null}
            />
        </main>
    );
}

export default IngredientesPage;