import type { CartItem } from "@/store/cartStore";
import CarritoItem from "./CarritoItem";

interface CarritoListProps {
    items: CartItem[];
    modo: "editable" | "lectura";
    onActualizarCantidad?: (productoId: number, cantidad: number) => void;
    onQuitarProducto?: (productoId: number) => void;
    disabled?: boolean;
}

const CarritoList = ({
    items,
    modo,
    onActualizarCantidad,
    onQuitarProducto,
    disabled = false,
}: CarritoListProps) => {
    if (items.length === 0) {
        return (
            <p className="py-6 text-center text-sm text-muted">
                No hay productos en el carrito.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <CarritoItem
                    key={item.producto.id}
                    item={item}
                    modo={modo}
                    onActualizarCantidad={onActualizarCantidad}
                    onQuitarProducto={onQuitarProducto}
                    disabled={disabled}
                />
            ))}
        </div>
    );
};

export default CarritoList;