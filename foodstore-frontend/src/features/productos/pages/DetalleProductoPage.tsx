import { Link, useParams } from "react-router-dom";

import { EmptyState, ErrorState, LoadingState } from "@/shared";

import { ProductoCard } from "../components/ProductoCard";
import { useProducto } from "../hooks/useProductos";

const DetalleProductoPage = () => {
    const { productoId } = useParams();

    const id = Number(productoId);
    const idValido = Number.isInteger(id) && id > 0;

    const productoQuery = useProducto(id);

    if (!idValido) {
        return <EmptyState mensaje="El producto solicitado no existe." />;
    }

    if (productoQuery.isLoading) {
        return <LoadingState mensaje="Cargando producto..." />;
    }

    if (productoQuery.isError) {
        return (
            <ErrorState
                mensaje="Error al recuperar el producto."
                onReintentar={() => productoQuery.refetch()}
            />
        );
    }

    if (!productoQuery.data) {
        return <EmptyState mensaje="El producto solicitado no existe." />;
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    to="/"
                    className="text-sm font-medium text-primary hover:underline"
                >
                    ← Volver al catálogo
                </Link>
            </div>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">
                    Detalle del producto
                </h1>

                <p className="mt-2 text-muted">
                    Conocé más información sobre nuestro producto.
                </p>
            </header>

            <section className="mx-auto max-w-2xl">
                <ProductoCard
                    producto={productoQuery.data}
                    modo="publico"
                    enlaceDetalle={false}
                />
            </section>
        </main>
    );
};

export default DetalleProductoPage;