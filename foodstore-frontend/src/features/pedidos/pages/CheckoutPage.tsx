import { useEffect, useCallback } from "react";
import { useForm } from "@tanstack/react-form";

import type { CartItem } from "@/store/cartStore";
import type {
    FormaPago,
    PedidoCreate,
} from "../types/pedido.types";

import CarritoList from "../components/CarritoList";
import { Modal } from "@/shared";

interface CheckoutPageProps {
    isOpen: boolean;
    items: CartItem[];
    onClose: () => void;
    onSubmit: (pedido: PedidoCreate) => void;
    isPending: boolean;
    error: string | null;
}

function CheckoutPage({
    isOpen,
    items,
    onClose,
    onSubmit,
    isPending,
    error,
}: CheckoutPageProps) {
    const handleClose = useCallback(() => {
        if (!isPending) {
            onClose();
        }
    }, [isPending, onClose]);

    const form = useForm({
        defaultValues: {
            direccion_entrega: "",
            forma_pago: "" as FormaPago | "",
            notas: "",
        },

        onSubmit: async ({ value }) => {
            onSubmit({
                direccion_entrega: value.direccion_entrega.trim(),
                forma_pago: value.forma_pago as FormaPago,
                notas: value.notas.trim() || null,
                items: items.map((item) => ({
                    producto_id: item.producto.id,
                    cantidad: item.cantidad,
                })),
            });
        },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                direccion_entrega: "",
                forma_pago: "",
                notas: "",
            });
        }
    }, [isOpen, form.reset]);

    const total = items.reduce(
        (acumulado, item) =>
            acumulado +
            Number(item.producto.precio_base) * item.cantidad,
        0,
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Finalizar compra"
            size="lg"
            closeOnOverlay={!isPending}
            showCloseButton={!isPending}
            footer={
                <>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isPending}
                        className="btn btn-secondary"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={isPending || items.length === 0}
                        className="btn btn-success"
                    >
                        {isPending ? "Confirmando..." : "Confirmar compra"}
                    </button>
                </>
            }
        >
            {error && (
                <p
                    role="alert"
                    className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                >
                    {error}
                </p>
            )}

            <form
                id="checkout-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!isPending) {
                        void form.handleSubmit();
                    }
                }}
            >
                <div className="mb-4">
                    <label
                        htmlFor="direccion_entrega"
                        className="form-label"
                    >
                        Dirección de entrega
                    </label>

                    <form.Field
                        name="direccion_entrega"
                        validators={{
                            onBlur: ({ value }) => {
                                const direccion = value.trim();

                                if (direccion.length < 5) {
                                    return "La dirección debe tener al menos 5 caracteres.";
                                }

                                if (direccion.length > 200) {
                                    return "La dirección no puede superar los 200 caracteres.";
                                }

                                return undefined;
                            },
                        }}
                    >
                        {(field) => (
                            <>
                                <input
                                    id={field.name}
                                    type="text"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) =>
                                        field.handleChange(event.target.value)
                                    }
                                    maxLength={200}
                                    required
                                    aria-invalid={
                                        field.state.meta.errors.length > 0
                                    }
                                    placeholder="Ingresá tu dirección de entrega"
                                    className="form-input"
                                />

                                {field.state.meta.errors.length > 0 && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                )}
                            </>
                        )}
                    </form.Field>
                </div>

                <div className="mb-4">
                    <label className="form-label">
                        Forma de pago
                    </label>

                    <form.Field
                        name="forma_pago"
                        validators={{
                            onChange: ({ value }) =>
                                value === ""
                                    ? "Seleccioná una forma de pago."
                                    : undefined,
                        }}
                    >
                        {(field) => (
                            <>
                                <div className="space-y-3">
                                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
                                        <input
                                            type="radio"
                                            name={field.name}
                                            value="EFECTIVO"
                                            checked={
                                                field.state.value === "EFECTIVO"
                                            }
                                            onBlur={field.handleBlur}
                                            onChange={() =>
                                                field.handleChange("EFECTIVO")
                                            }
                                        />

                                        <span className="text-sm text-foreground">
                                            Efectivo
                                        </span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
                                        <input
                                            type="radio"
                                            name={field.name}
                                            value="TRANSFERENCIA"
                                            checked={
                                                field.state.value === "TRANSFERENCIA"
                                            }
                                            onBlur={field.handleBlur}
                                            onChange={() =>
                                                field.handleChange("TRANSFERENCIA")
                                            }
                                        />

                                        <span className="text-sm text-foreground">
                                            Transferencia
                                        </span>
                                    </label>
                                </div>

                                {field.state.meta.errors.length > 0 && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {field.state.meta.errors.join(", ")}
                                    </p>
                                )}
                            </>
                        )}
                    </form.Field>
                </div>

                <div className="mb-6">
                    <label htmlFor="notas" className="form-label">
                        Notas adicionales (opcional)
                    </label>

                    <form.Field name="notas">
                        {(field) => (
                            <textarea
                                id={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) =>
                                    field.handleChange(event.target.value)
                                }
                                rows={3}
                                className="form-input"
                                placeholder="Agregá alguna indicación para tu pedido..."
                            />
                        )}
                    </form.Field>
                </div>

                <div className="mb-2 rounded-lg border border-border bg-background p-4">
                    <h3 className="mb-4 font-semibold text-foreground">
                        Resumen del pedido
                    </h3>

                    <CarritoList
                        items={items}
                        modo="lectura"
                    />

                    <div className="mt-4 flex justify-between border-t border-border pt-4">
                        <span className="font-bold text-foreground">
                            Total
                        </span>

                        <span className="text-lg font-bold text-foreground">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default CheckoutPage;