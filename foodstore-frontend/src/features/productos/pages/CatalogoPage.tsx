import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { EmptyState, ErrorState, LoadingState } from "@/shared";
import { useDebounce } from "@/shared/hooks/useDebounce";

import type { CatalogoLayoutContext } from "@/shared/layout/CatalogoLayout";

import { ProductoCard } from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";
import Pagination from "@/shared/components/Paginacion";

const CatalogoPage = () => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [limite, setLimite] = useState(10);

    const skip = (paginaActual - 1) * limite;

    const [busqueda, setBusqueda] = useState("");

    const { categoriaId } = useOutletContext<CatalogoLayoutContext>();

    const busquedaDebounce = useDebounce(busqueda);

    useEffect(() => {
        setPaginaActual(1);
    }, [busquedaDebounce, categoriaId]);

    const { productosQuery } = useProductos(
        busquedaDebounce,
        categoriaId,
        {
            skip,
            limit: limite,
            activo: true,
            disponible: true,
        },
    );

    if (productosQuery.isLoading) {
        return <LoadingState mensaje="Cargando productos..." />;
    }

    if (productosQuery.isError || !productosQuery.data) {
        return (
            <ErrorState
                mensaje="Error al recuperar los productos."
                onReintentar={() => productosQuery.refetch()}
            />
        );
    }
    const totalPaginas = Math.ceil(
        productosQuery.data.total / limite
    );
    return (
        <main className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                    Nuestro catálogo
                </h1>

                <p className="mt-2 text-muted">
                    Explorá nuestros productos disponibles.
                </p>
            </header>

            <div className="mb-8">
                <label
                    htmlFor="buscar-producto"
                    className="form-label"
                >
                    Buscar productos
                </label>

                <input
                    id="buscar-producto"
                    type="search"
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                    placeholder="Buscar por nombre..."
                    className="form-input w-full"
                />
            </div>

            {productosQuery.data.items.length === 0 ? (
                <EmptyState mensaje="No se encontraron productos." />
            ) : (
                <section
                    aria-label="Productos disponibles"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {productosQuery.data.items.map((producto) => (
                        <ProductoCard
                            key={producto.id}
                            producto={producto}
                            modo="publico"
                        />
                    ))}
                </section>

            )}
            <Pagination
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                limite={limite}
                onCambiarPagina={setPaginaActual}
                onCambiarLimite={(nuevoLimite) => {
                    setLimite(nuevoLimite);
                    setPaginaActual(1);
                }}
            />
        </main>
    );
};

export default CatalogoPage;