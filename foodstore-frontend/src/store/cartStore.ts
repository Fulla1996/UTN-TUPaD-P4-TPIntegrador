import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useAuthStore } from "./authStore";
import type { ProductoPublic } from "@/features/productos/types/producto.types";
import { obtenerProducto } from "@/features/productos";

export interface CartItem {
    producto: ProductoPublic;
    cantidad: number;
}

export interface ResultadoSincronizacion {
    precioCambio: boolean;
    stockCambio: boolean;
}

interface CartState {
    carts: Record<number, CartItem[]>;

    agregarProducto: (producto: ProductoPublic) => void;
    quitarProducto: (productoId: number) => void;
    actualizarCantidad: (productoId: number, cantidad: number) => void;
    vaciarCarrito: () => void;
    sincronizarCarrito: () => Promise<ResultadoSincronizacion>;
    cantidadTotal: () => number;
    total: () => number;
}

const obtenerUsuarioId = (): number | null => {
    return useAuthStore.getState().user?.id ?? null;
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            carts: {},

            agregarProducto: (producto) => {
                const usuarioId = obtenerUsuarioId();

                if (
                    usuarioId === null ||
                    !producto.activo ||
                    !producto.disponible ||
                    producto.stock <= 0
                ) {
                    return;
                }

                set((state) => {
                    const items = state.carts[usuarioId] ?? [];

                    const existente = items.find(
                        (item) => item.producto.id === producto.id,
                    );

                    const nuevosItems = existente
                        ? items.map((item) =>
                            item.producto.id === producto.id
                                ? {
                                    ...item,
                                    producto,
                                    cantidad: Math.min(
                                        item.cantidad + 1,
                                        producto.stock,
                                    ),
                                }
                                : item,
                        )
                        : [
                            ...items,
                            {
                                producto,
                                cantidad: 1,
                            },
                        ];

                    return {
                        carts: {
                            ...state.carts,
                            [usuarioId]: nuevosItems,
                        },
                    };
                });
            },

            quitarProducto: (productoId) => {
                const usuarioId = obtenerUsuarioId();

                if (usuarioId === null) return;

                set((state) => ({
                    carts: {
                        ...state.carts,
                        [usuarioId]: (state.carts[usuarioId] ?? []).filter(
                            (item) => item.producto.id !== productoId,
                        ),
                    },
                }));
            },

            actualizarCantidad: (productoId, cantidad) => {
                const usuarioId = obtenerUsuarioId();

                if (
                    usuarioId === null ||
                    !Number.isInteger(cantidad)
                ) {
                    return;
                }

                if (cantidad <= 0) {
                    get().quitarProducto(productoId);
                    return;
                }

                set((state) => ({
                    carts: {
                        ...state.carts,
                        [usuarioId]: (state.carts[usuarioId] ?? []).map(
                            (item) =>
                                item.producto.id === productoId
                                    ? {
                                        ...item,
                                        cantidad: Math.min(
                                            cantidad,
                                            item.producto.stock,
                                        ),
                                    }
                                    : item,
                        ),
                    },
                }));
            },

            vaciarCarrito: () => {
                const usuarioId = obtenerUsuarioId();

                if (usuarioId === null) return;

                set((state) => ({
                    carts: {
                        ...state.carts,
                        [usuarioId]: [],
                    },
                }));
            },

            sincronizarCarrito: async () => {
                const usuarioId = obtenerUsuarioId();

                if (usuarioId === null) {
                    return {
                        precioCambio: false,
                        stockCambio: false,
                    };
                }

                const itemsActuales = get().carts[usuarioId] ?? [];

                let precioCambio = false;
                let stockCambio = false;

                const itemsActualizados = await Promise.all(
                    itemsActuales.map(async (item) => {
                        const productoActualizado = await obtenerProducto(
                            item.producto.id,
                        );

                        const disponible =
                            productoActualizado.activo &&
                            productoActualizado.disponible;

                        const stockEfectivo = disponible
                            ? productoActualizado.stock
                            : 0;

                        if (
                            Number(item.producto.precio_base) !==
                            Number(productoActualizado.precio_base)
                        ) {
                            precioCambio = true;
                        }

                        if (
                            item.producto.stock > stockEfectivo ||
                            item.cantidad > stockEfectivo
                        ) {
                            stockCambio = true;
                        }

                        return {
                            producto: {
                                ...productoActualizado,
                                stock: stockEfectivo,
                            },
                            cantidad: Math.min(item.cantidad, stockEfectivo),
                        };
                    }),
                );

                set((state) => ({
                    carts: {
                        ...state.carts,
                        [usuarioId]: itemsActualizados,
                    },
                }));

                return {
                    precioCambio,
                    stockCambio,
                };
            },

            cantidadTotal: () => {
                const usuarioId = obtenerUsuarioId();

                if (usuarioId === null) return 0;

                return (get().carts[usuarioId] ?? []).reduce(
                    (total, item) => total + item.cantidad,
                    0,
                );
            },

            total: () => {
                const usuarioId = obtenerUsuarioId();

                if (usuarioId === null) return 0;

                return (get().carts[usuarioId] ?? []).reduce(
                    (total, item) =>
                        total +
                        Number(item.producto.precio_base) * item.cantidad,
                    0,
                );
            },
        }),
        {
            name: "food-store-cart",
            partialize: (state) => ({
                carts: state.carts,
            }),
        },
    ),
);