import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";

import { Modal } from "@/shared/";

import type {
    CategoriaCreate,
    CategoriaPublic,
} from "../types/categoria.types";

interface CategoriaModalProps {
    isOpen: boolean;
    categoria: CategoriaPublic | null;
    onClose: () => void;
    onSubmit: (categoria: CategoriaCreate) => void;
    isPending: boolean;
    error: string | null;
}

function CategoriaModal({
    isOpen,
    categoria,
    onClose,
    onSubmit,
    isPending,
    error,
}: CategoriaModalProps) {
    const form = useForm({
        defaultValues: {
            nombre: "",
            descripcion: "",
        },

        onSubmit: async ({ value }) => {
            onSubmit({
                nombre: value.nombre.trim(),
                descripcion: value.descripcion.trim() || null,
            });
        },
    });

    useEffect(() => {
        if (!isOpen) return;

        if (categoria) {
            form.reset({
                nombre: categoria.nombre,
                descripcion: categoria.descripcion ?? "",
            });
        } else {
            form.reset({
                nombre: "",
                descripcion: "",
            });
        }
    }, [categoria, isOpen, form.reset]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={categoria ? "Editar categoría" : "Nueva categoría"}
            size="md"
            closeOnOverlay={!isPending}
            showCloseButton={!isPending}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="btn btn-secondary"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        form="categoria-form"
                        disabled={isPending}
                        className="btn btn-success"
                    >
                        {isPending ? "Guardando..." : "Guardar"}
                    </button>
                </>
            }
        >
            {error && (
                <p
                    role="alert"
                    className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                >
                    Error: {error}
                </p>
            )}

            <form
                id="categoria-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!isPending) {
                        form.handleSubmit();
                    }
                }}
                className="space-y-4"
            >
                {/* Nombre */}
                <form.Field
                    name="nombre"
                    validators={{
                        onBlur: ({ value }) => {
                            const nombre = value.trim();

                            if (nombre.length < 3) {
                                return "El nombre debe tener al menos 3 caracteres";
                            }

                            if (nombre.length > 80) {
                                return "El nombre no puede superar los 80 caracteres";
                            }

                            return undefined;
                        },
                    }}
                >
                    {(field) => (
                        <div>
                            <label
                                htmlFor={field.name}
                                className="form-label"
                            >
                                Nombre
                            </label>

                            <input
                                id={field.name}
                                type="text"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                maxLength={80}
                                required
                                aria-invalid={field.state.meta.errors.length > 0}
                                className="form-input"
                            />

                            {field.state.meta.errors.length > 0 && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {field.state.meta.errors.join(", ")}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>

                {/* Descripción */}
                <form.Field name="descripcion">
                    {(field) => (
                        <div>
                            <label
                                htmlFor={field.name}
                                className="form-label"
                            >
                                Descripción
                            </label>

                            <textarea
                                id={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                rows={3}
                                className="form-input"
                            />

                            {field.state.meta.errors.length > 0 && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {field.state.meta.errors.join(", ")}
                                </p>
                            )}
                        </div>
                    )}
                </form.Field>
            </form>
        </Modal>
    );
}

export default CategoriaModal;