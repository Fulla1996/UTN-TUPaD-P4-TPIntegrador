import { EmptyState, ErrorState, LoadingState } from "@/shared/components";
import { ProductoCard } from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";

const CatalogoPage = () => {
    const { productosQuery } = useProductos();

    if (productosQuery.isLoading) {
        return <LoadingState mensaje="Cargando usuarios..." />;
    }

    if (productosQuery.isError || !productosQuery.data) {
        return (
            <ErrorState
                mensaje={"Error al recuperar los productos."}
                onReintentar={() => productosQuery.refetch()}
            />
        );
    }

    const productosDisponibles = productosQuery.data.items.filter(
        (producto) =>
            producto.activo &&
            producto.disponible &&
            producto.stock > 0
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

            {productosDisponibles.length === 0 ? (
                <EmptyState mensaje="No hay productos registrados." />
            ) : (
                <section
                    aria-label="Productos disponibles"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {productosDisponibles.map((producto) => (
                        <ProductoCard
                            key={producto.id}
                            producto={producto}
                            modo="publico"
                        />
                    ))}
                </section>
            )}
        </main>
    );
};

export default CatalogoPage;