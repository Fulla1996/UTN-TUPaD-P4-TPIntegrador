import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";

import type {
  IngredienteCreate,
  IngredientePublic,
} from "../types/ingrediente.types";

interface IngredienteModalProps {
  isOpen: boolean;
  ingrediente: IngredientePublic | null;
  onClose: () => void;
  onSubmit: (ingrediente: IngredienteCreate) => void;
  isPending: boolean;
  error: string | null;
}

function IngredienteModal({
  isOpen,
  ingrediente,
  onClose,
  onSubmit,
  isPending,
  error,
}: IngredienteModalProps) {

  const form = useForm({
    defaultValues: {
      nombre: "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
      });
    },
  });

  useEffect(() => {
    if (ingrediente) {
      form.reset({
        nombre: ingrediente.nombre,
      });
    } else {
      form.reset({
        nombre: "",
      });
    }
  }, [ingrediente, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-xl">
        <h2 className="mb-5 text-xl font-bold text-foreground">
          {ingrediente ? "Editar Ingrediente" : "Nuevo Ingrediente"}
        </h2>

        {error && (
          <p className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            Error: {error}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>

            <form.Field
              name="nombre"
              validators={{
                onBlur: ({ value }) =>
                  value.trim().length < 1
                    ? "El nombre es obligatorio"
                    : undefined,
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
              className="btn btn-secondary"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-success"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IngredienteModal;