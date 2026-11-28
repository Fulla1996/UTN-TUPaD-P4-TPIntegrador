import { useState } from "react";

import type {
    CategoriaCreate,
    CategoriaPublic,
} from "../types/categoria.types";

import { useCategorias } from "../hooks/useCategorias";

import CategoriaList from "../components/CategoriaList";
import CategoriaModal from "../components/CategoriaModal";

import {
    LoadingState,
    EmptyState,
    ErrorState,
} from "@/shared";

function AdminCategoriasPage() {
    const {
        categoriasQuery,
        crearMutation,
        editarMutation,
        eliminarMutation,
    } = useCategorias();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [categoriaSeleccionada, setCategoriaSeleccionada] =
        useState<CategoriaPublic | null>(null);

    const handleCerrarModal = () => {
        setIsModalOpen(false);
        setCategoriaSeleccionada(null);
    };

    const errorFormulario =
        crearMutation.error ??
        editarMutation.error;

    const limpiarErrores = () => {
        crearMutation.reset();
        editarMutation.reset();
        eliminarMutation.reset();
    };

    const handleNuevaCategoria = () => {
        limpiarErrores();
        setCategoriaSeleccionada(null);
        setIsModalOpen(true);
    };

    const handleEditarCategoria = (categoria: CategoriaPublic) => {
        limpiarErrores();
        setCategoriaSeleccionada(categoria);
        setIsModalOpen(true);
    };

    const handleGuardarCategoria = (categoria: CategoriaCreate) => {
        if (categoriaSeleccionada) {
            editarMutation.mutate(
                {
                    id: categoriaSeleccionada.id,
                    categoria,
                },
                {
                    onSuccess: () => {
                        limpiarErrores();
                        handleCerrarModal();
                    },
                },
            );
        } else {
            crearMutation.mutate(
                categoria,
                {
                    onSuccess: () => {
                        limpiarErrores();
                        handleCerrarModal();
                    },
                },
            );
        }
    };

    const handleEliminarCategoria = (id: number) => {
        if (eliminarMutation.isPending) return;

        const confirmar = window.confirm(
            "¿Estás seguro de que deseas eliminar esta categoría?",
        );

        if (confirmar) {
            eliminarMutation.mutate(id);
        }
    };

    if (categoriasQuery.isLoading) {
        return <LoadingState mensaje="Cargando categorías..." />;
    }

    if (categoriasQuery.isError) {
        return (
            <ErrorState
                mensaje={`Error al cargar las categorías: ${categoriasQuery.error.message}`}
                onReintentar={() => categoriasQuery.refetch()}
            />
        );
    }

    return (
        <main className="container mx-auto min-h-screen bg-background px-4 py-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                    Gestión de Categorías
                </h1>

                <button
                    onClick={handleNuevaCategoria}
                    className="btn btn-primary"
                >
                    Nueva categoría
                </button>
            </div>

            {eliminarMutation.error && (
                <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                    {eliminarMutation.error.message}
                </div>
            )}

            {categoriasQuery.data && categoriasQuery.data.length === 0 ? (
                <EmptyState mensaje="Todavía no hay categorías registradas." />
            ) : (
                <CategoriaList
                    categorias={categoriasQuery.data ?? []}
                    onEditar={handleEditarCategoria}
                    onEliminar={handleEliminarCategoria}
                />
            )}

            <CategoriaModal
                isOpen={isModalOpen}
                categoria={categoriaSeleccionada}
                onClose={handleCerrarModal}
                onSubmit={handleGuardarCategoria}
                isPending={
                    crearMutation.isPending ||
                    editarMutation.isPending
                }
                error={errorFormulario?.message ?? null}
            />
        </main>
    );
}

export default AdminCategoriasPage;