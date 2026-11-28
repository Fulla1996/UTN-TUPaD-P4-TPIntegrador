import { useState } from "react";

import type {
    ProductoCreate,
    ProductoPublic,
    ProductoSortBy,
    SortOrder
} from "../types/producto.types";

import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "@/features/categorias";

import ProductoList from "../components/ProductoList";
import { ProductoModal } from "../components/ProductoModal";

import {
    ErrorState,
    LoadingState,
    EmptyState,
} from "@/shared";

const AdminProductosPage = () => {
    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const [limite] = useState(10);

    // Ordenamiento
    const [sortBy, setSortBy] = useState<ProductoSortBy>("id");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    const {
        productosQuery,
        crearMutation,
        editarMutation,
        eliminarMutation,
        cambiarEstadoMutation,
    } = useProductos("", null, {
        skip: (paginaActual - 1) * limite,
        limit: limite,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const { categoriasQuery } = useCategorias();

    // Estados del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] =
        useState<ProductoPublic | null>(null);

    // Limpiar errores
    const limpiarErrores = () => {
        crearMutation.reset();
        editarMutation.reset();
        eliminarMutation.reset();
        cambiarEstadoMutation.reset();
    };

    // Cerrar modal
    const cerrarModal = () => {
        setIsModalOpen(false);
        setProductoSeleccionado(null);
        limpiarErrores();
    };

    // Abrir modal para crear
    const handleNuevoProducto = () => {
        limpiarErrores();
        setProductoSeleccionado(null);
        setIsModalOpen(true);
    };

    // Abrir modal para editar
    const handleEditarProducto = (producto: ProductoPublic) => {
        limpiarErrores();
        setProductoSeleccionado(producto);
        setIsModalOpen(true);
    };

    // Guardar producto
    const handleGuardarProducto = (producto: ProductoCreate) => {
        if (productoSeleccionado) {
            editarMutation.mutate(
                {
                    id: productoSeleccionado.id,
                    producto,
                },
                {
                    onSuccess: cerrarModal,
                },
            );
        } else {
            crearMutation.mutate(producto, {
                onSuccess: cerrarModal,
            });
        }
    };

    // Eliminar producto
    const handleEliminarProducto = (id: number) => {
        const confirmar = window.confirm(
            "¿Estás seguro de que deseas eliminar este producto?",
        );

        if (confirmar) {
            eliminarMutation.mutate(id);
        }
    };

    // Cambiar disponibilidad
    const handleCambiarDisponibilidad = (producto: ProductoPublic) => {
        cambiarEstadoMutation.mutate({
            id: producto.id,
            producto: {
                disponible: !producto.disponible,
            },
        });
    };

    // Cambiar página
    const handleCambiarPagina = (pagina: number) => {
        setPaginaActual(pagina);
    };

    // Cambiar ordenamiento
    const handleCambiarOrdenamiento = (
        nuevoSortBy: ProductoSortBy,
        nuevoSortOrder: SortOrder,
    ) => {
        setSortBy(nuevoSortBy);
        setSortOrder(nuevoSortOrder);
        setPaginaActual(1);
    };

    // Estado de carga
    if (productosQuery.isLoading || categoriasQuery.isLoading) {
        return <LoadingState mensaje="Cargando productos..." />;
    }

    // Error al recuperar productos
    if (productosQuery.isError || !productosQuery.data) {
        return (
            <ErrorState
                mensaje="Error al recuperar los productos."
                onReintentar={() => productosQuery.refetch()}
            />
        );
    }

    // Error al recuperar categorías
    if (categoriasQuery.isError || !categoriasQuery.data) {
        return (
            <ErrorState
                mensaje="Error al recuperar las categorías."
                onReintentar={() => categoriasQuery.refetch()}
            />
        );
    }

    const errorFormulario = crearMutation.error ?? editarMutation.error;

    return (
        <div className="min-h-screen space-y-6 bg-background p-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                    Gestión de productos
                </h1>

                <button
                    className="btn btn-primary"
                    onClick={handleNuevoProducto}
                >
                    Nuevo producto
                </button>
            </div>

            {/* Error al eliminar */}
            {eliminarMutation.isError && (
                <p className="rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950 dark:text-red-300">
                    Error al eliminar el producto: {eliminarMutation.error.message}
                </p>
            )}

            {/* Error al cambiar disponibilidad */}
            {cambiarEstadoMutation.isError && (
                <p className="rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950 dark:text-red-300">
                    Error al cambiar la disponibilidad:{" "}
                    {cambiarEstadoMutation.error.message}
                </p>
            )}

            {/* Listado */}
            {productosQuery.data.items.length > 0 ? (
                <ProductoList
                    productos={productosQuery.data.items}
                    total={productosQuery.data.total}
                    paginaActual={paginaActual}
                    limite={limite}
                    onCambiarPagina={handleCambiarPagina}
                    onCambiarOrdenamiento={handleCambiarOrdenamiento}
                    onEditar={handleEditarProducto}
                    onEliminar={handleEliminarProducto}
                    onCambiarDisponibilidad={handleCambiarDisponibilidad}
                />
            ) : (
                <EmptyState mensaje="Todavía no hay productos registrados." />
            )}

            {/* Modal */}
            <ProductoModal
                isOpen={isModalOpen}
                categorias={categoriasQuery.data}
                producto={productoSeleccionado}
                onSubmit={handleGuardarProducto}
                onClose={cerrarModal}
                isPending={
                    crearMutation.isPending || editarMutation.isPending
                }
                error={errorFormulario?.message ?? null}
            />
        </div>
    );
};

export default AdminProductosPage;