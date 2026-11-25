import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-xl">
        <h2 className="mb-5 text-xl font-bold text-foreground">
          {categoria ? "Editar categoría" : "Nueva categoría"}
        </h2>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            Error: {error}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!isPending) {
              form.handleSubmit();
            }
          }}
        >
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>

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
                <>
                  <input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
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
                </>
              )}
            </form.Field>
          </div>

          <div className="mb-5">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>

            <form.Field
              name="descripcion"
            >
              {(field) => (
                <>
                  <textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={3}
                    aria-invalid={field.state.meta.errors.length > 0}
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

          <div className="flex justify-end gap-3">
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
              disabled={isPending}
              className="btn btn-success"
            >
              {isPending ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoriaModal;