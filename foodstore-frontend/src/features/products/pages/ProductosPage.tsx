import { useState } from "react";

import type {
    ProductoCreate,
    ProductoPublic,
    ProductoUpdate,
} from "../types/producto.types";

import { useProductos } from "../hooks/useProductos";
import { useUnidadesMedida } from "../hooks/useUnidadesMedida";

import ProductoList from "../components/ProductoList";
import { ProductoModal } from "../components/ProductoModal";

import {
    ErrorState,
    LoadingState,
    EmptyState,
} from "@/shared/components";

import { useAuthStore } from "@/features/auth";

const ProductosPage = () => {

    // Productos
    const {
        productosQuery,
        crearMutation,
        editarMutation,
        eliminarMutation,
        cambiarEstadoMutation,
    } = useProductos();

    // Unidades de medida
    const unidadesQuery = useUnidadesMedida();

    // Usuario autenticado y permisos
    const user = useAuthStore((state) => state.user);
    const esAdmin = user?.roles.includes("admin") ?? false;

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
                });
        } else {
            crearMutation.mutate(
                producto,
                {
                    onSuccess: cerrarModal,
                });
        }
    };

    // Eliminar producto
    const handleEliminarProducto = (id: number) => {
        const confirmar = window.confirm(
            "¿Estás seguro de que deseas eliminar este producto?"
        );

        if (confirmar) {
            eliminarMutation.mutate(id);
        }
    };

    // Cambiar disponibilidad
    const handleCambiarDisponibilidad = (producto: ProductoPublic) => {
        const productoActualizado: ProductoUpdate = {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio_base: String(producto.precio_base),
            stock_cantidad: String(producto.stock_cantidad),
            disponible: !producto.disponible,
            imagenes_url: producto.imagenes_url,
            unidad_venta_id: producto.unidad_venta.id,
        };

        cambiarEstadoMutation.mutate({
            id: producto.id,
            producto: productoActualizado,
        });
    };

    // Estado de carga
    if (productosQuery.isLoading || unidadesQuery.isLoading) {
        return <LoadingState mensaje="Cargando productos..." />;
    }

    // Error al recuperar productos
    if (productosQuery.isError) {
        return (
            <ErrorState
                mensaje={`Error al recuperar los productos: ${productosQuery.error.message}`}
                onReintentar={() => productosQuery.refetch()}
            />
        );
    }

    // Error al recuperar unidades
    if (unidadesQuery.isError || !unidadesQuery.data) {
        return (
            <ErrorState
                mensaje="Error al recuperar las unidades de medida."
                onReintentar={() => unidadesQuery.refetch()}
            />
        );
    }

    const errorFormulario =
        crearMutation.error ?? editarMutation.error;

    return (
        <div className="min-h-screen space-y-6 bg-background p-6">

            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">
                    Gestión de productos
                </h1>

                {esAdmin && (
                    <button
                        className="btn btn-primary"
                        onClick={handleNuevoProducto}
                    >
                        Nuevo producto
                    </button>
                )}
            </div>

            {/* Error al eliminar */}
            {eliminarMutation.isError && (
                <p className="rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950 dark:text-red-300">
                    Error al eliminar el producto:{" "}
                    {eliminarMutation.error.message}
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
            {productosQuery.data && productosQuery.data.length > 0 ? (
                <ProductoList
                    productos={productosQuery.data}
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
                unidades={unidadesQuery.data}
                producto={productoSeleccionado}
                onSubmit={handleGuardarProducto}
                onClose={cerrarModal}
                isPending={
                    crearMutation.isPending ||
                    editarMutation.isPending
                }
                error={errorFormulario?.message ?? null}
            />

        </div>
    );
};

export default ProductosPage;