import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";

import { Modal } from "@/shared";

import type { CategoriaPublic } from "@/features/categorias";

import type {
    ProductoCreate,
    ProductoPublic,
} from "@/features/productos";

interface ProductoModalProps {
    isOpen: boolean;
    categorias: CategoriaPublic[];
    producto: ProductoPublic | null;
    onSubmit: (producto: ProductoCreate) => void;
    onClose: () => void;
    isPending: boolean;
    error: string | null;
}

interface ProductoFormValues {
    categoria_id: number;
    nombre: string;
    descripcion: string;
    precio_base: string;
    stock: string;
    disponible: boolean;
    imagen_url: string;
}

const valoresIniciales: ProductoFormValues = {
    categoria_id: 0,
    nombre: "",
    descripcion: "",
    precio_base: "",
    stock: "0",
    disponible: true,
    imagen_url: "",
};

export const ProductoModal = ({
    isOpen,
    categorias,
    producto,
    onSubmit,
    onClose,
    isPending,
    error,
}: ProductoModalProps) => {
    const form = useForm({
        defaultValues: valoresIniciales,

        onSubmit: async ({ value }) => {
            onSubmit({
                categoria_id: value.categoria_id,
                nombre: value.nombre.trim(),
                descripcion: value.descripcion.trim() || null,
                precio_base: Number(value.precio_base),
                stock: Number(value.stock),
                disponible: value.disponible,
                imagen_url: value.imagen_url.trim() || null,
            });
        },
    });

    useEffect(() => {
        if (!isOpen) return;

        if (producto) {
            form.reset({
                categoria_id: producto.categoria_id,
                nombre: producto.nombre,
                descripcion: producto.descripcion ?? "",
                precio_base: String(producto.precio_base),
                stock: String(producto.stock),
                disponible: producto.disponible,
                imagen_url: producto.imagen_url ?? "",
            });
        } else {
            form.reset(valoresIniciales);
        }
    }, [isOpen, producto, form.reset]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={producto ? "Editar producto" : "Nuevo producto"}
            size="lg"
            closeOnOverlay={!isPending}
            showCloseButton={!isPending}
            footer={
                <>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        form="producto-form"
                        className="btn btn-primary"
                        disabled={isPending}
                    >
                        {isPending ? "Guardando..." : "Guardar"}
                    </button>
                </>
            }
        >
            {error && (
                <p
                    role="alert"
                    className="mb-4 rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                >
                    {error}
                </p>
            )}

            <form
                id="producto-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!isPending) {
                        form.handleSubmit();
                    }
                }}
                className="space-y-4"
            >
                {/* Categoría */}
                <form.Field
                    name="categoria_id"
                    validators={{
                        onChange: ({ value }) =>
                            value <= 0
                                ? "Seleccioná una categoría."
                                : undefined,
                    }}
                >
                    {(field) => (
                        <div>
                            <label className="form-label" htmlFor="categoria_id">
                                Categoría
                            </label>

                            <select
                                id="categoria_id"
                                className="form-input"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(Number(e.target.value))
                                }
                            >
                                <option value={0}>
                                    Seleccionar categoría
                                </option>

                                {categorias
                                    .filter((categoria) => categoria.activo)
                                    .map((categoria) => (
                                        <option
                                            key={categoria.id}
                                            value={categoria.id}
                                        >
                                            {categoria.nombre}
                                        </option>
                                    ))}
                            </select>

                            {field.state.meta.errors.map((error) => (
                                <p
                                    key={error}
                                    className="text-sm text-red-600 dark:text-red-400"
                                >
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </form.Field>

                {/* Nombre */}
                <form.Field
                    name="nombre"
                    validators={{
                        onBlur: ({ value }) => {
                            const nombre = value.trim();

                            if (nombre.length < 3) {
                                return "El nombre debe tener al menos 3 caracteres.";
                            }

                            if (nombre.length > 100) {
                                return "El nombre no puede superar los 100 caracteres.";
                            }

                            return undefined;
                        },
                    }}
                >
                    {(field) => (
                        <div>
                            <label className="form-label" htmlFor="nombre">
                                Nombre
                            </label>

                            <input
                                id="nombre"
                                type="text"
                                className="form-input"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                maxLength={100}
                                placeholder="Pizza"
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />

                            {field.state.meta.errors.map((error) => (
                                <p
                                    key={error}
                                    className="text-sm text-red-600 dark:text-red-400"
                                >
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </form.Field>

                {/* Descripción */}
                <form.Field name="descripcion">
                    {(field) => (
                        <div>
                            <label className="form-label" htmlFor="descripcion">
                                Descripción
                            </label>

                            <textarea
                                id="descripcion"
                                className="form-input"
                                placeholder="Descripción del producto"
                                rows={3}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                        </div>
                    )}
                </form.Field>

                {/* Precio */}
                <form.Field
                    name="precio_base"
                    validators={{
                        onBlur: ({ value }) => {
                            if (!value.trim()) {
                                return "El precio es obligatorio.";
                            }

                            if (!Number.isFinite(Number(value))) {
                                return "Ingresá un precio válido.";
                            }

                            if (Number(value) <= 0) {
                                return "El precio debe ser mayor que cero.";
                            }

                            return undefined;
                        },
                    }}
                >
                    {(field) => (
                        <div>
                            <label className="form-label" htmlFor="precio_base">
                                Precio base
                            </label>

                            <input
                                id="precio_base"
                                type="number"
                                min="0.01"
                                step="0.01"
                                className="form-input"
                                placeholder="1500.00"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />

                            {field.state.meta.errors.map((error) => (
                                <p
                                    key={error}
                                    className="text-sm text-red-600 dark:text-red-400"
                                >
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </form.Field>

                {/* Stock */}
                <form.Field
                    name="stock"
                    validators={{
                        onBlur: ({ value }) => {
                            if (!value.trim()) {
                                return "El stock es obligatorio.";
                            }

                            if (!Number.isInteger(Number(value))) {
                                return "El stock debe ser un número entero.";
                            }

                            if (Number(value) < 0) {
                                return "El stock no puede ser negativo.";
                            }

                            return undefined;
                        },
                    }}
                >
                    {(field) => (
                        <div>
                            <label className="form-label" htmlFor="stock">
                                Stock
                            </label>

                            <input
                                id="stock"
                                type="number"
                                min="0"
                                step="1"
                                className="form-input"
                                placeholder="10"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />

                            {field.state.meta.errors.map((error) => (
                                <p
                                    key={error}
                                    className="text-sm text-red-600 dark:text-red-400"
                                >
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </form.Field>

                {/* Imagen */}
                <form.Field name="imagen_url">
                    {(field) => (
                        <div>
                            <label className="form-label" htmlFor="imagen_url">
                                URL de imagen
                            </label>

                            <input
                                id="imagen_url"
                                type="url"
                                className="form-input"
                                placeholder="https://ejemplo.com/imagen.jpg"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                            />
                        </div>
                    )}
                </form.Field>

                {/* Disponibilidad */}
                <form.Field name="disponible">
                    {(field) => (
                        <div className="flex items-center gap-3">
                            <input
                                id="disponible"
                                type="checkbox"
                                checked={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.checked)
                                }
                            />

                            <label
                                htmlFor="disponible"
                                className="text-sm text-foreground"
                            >
                                Producto disponible para la venta
                            </label>
                        </div>
                    )}
                </form.Field>
            </form>
        </Modal>
    );
};

export default ProductoModal;