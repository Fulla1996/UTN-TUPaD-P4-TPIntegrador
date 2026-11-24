import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";

import type { UnidadMedida } from "../types/unidad_medida.types";
import type {
  ProductoCreate,
  ProductoPublic,
} from "../types/producto.types";

interface ProductoModalProps {
  isOpen: boolean;
  unidades: UnidadMedida[];
  producto: ProductoPublic | null;
  onSubmit: (producto: ProductoCreate) => void;
  onClose: () => void;
  isPending: boolean;
  error: string | null;
}

const valoresIniciales: ProductoCreate = {
  nombre: "",
  descripcion: null,
  precio_base: "",
  stock_cantidad: "",
  disponible: true,
  imagenes_url: [],
  unidad_venta_id: 0,
};

export const ProductoModal = ({
  isOpen,
  unidades,
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
        ...value,
        nombre: value.nombre.trim(),
        descripcion: value.descripcion?.trim() || null,
      });
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (producto) {
      form.reset({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_base: String(producto.precio_base),
        stock_cantidad: String(producto.stock_cantidad),
        disponible: producto.disponible,
        unidad_venta_id: producto.unidad_venta.id,
      });
    } else {
      form.reset(valoresIniciales);
    }
  }, [isOpen, producto]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="my-auto w-full max-w-xl rounded-xl border border-border bg-surface px-6 py-5 shadow-xl">

        <h2 className="mb-5 text-xl font-semibold text-foreground">
          {producto ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        {error && (
          <p className="mb-4 rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >

          {/* Nombre */}
          <form.Field
            name="nombre"
            validators={{
              onBlur: ({ value }) =>
                value.trim().length < 3
                  ? "El nombre debe tener al menos 3 caracteres."
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label className="form-label">
                  Nombre
                </label>

                <input
                  className="form-input"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  placeholder="Pizza"
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                />

                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-sm text-red-600 dark:text-red-400">
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
                <label className="form-label">
                  Descripción
                </label>

                <textarea
                  className="form-input"
                  placeholder="Descripción del producto"
                  rows={3}
                  value={field.state.value ?? ""}
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

                if (Number(value) < 0) {
                  return "El precio no puede ser negativo.";
                }

                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <label className="form-label">
                  Precio base
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  placeholder="1.26"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                />

                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* Unidad de venta */}
          <form.Field
            name="unidad_venta_id"
            validators={{
              onChange: ({ value }) =>
                value <= 0
                  ? "Seleccioná una unidad de medida."
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label className="form-label">
                  Unidad de venta
                </label>

                <select
                  className="form-input"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value))
                  }
                >
                  <option value={0}>
                    Seleccionar unidad
                  </option>

                  {unidades.map((unidad) => (
                    <option
                      key={unidad.id}
                      value={unidad.id}
                    >
                      {unidad.nombre} ({unidad.simbolo})
                    </option>
                  ))}
                </select>

                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* Stock */}
          <form.Subscribe
            selector={(state) => state.values.unidad_venta_id}
          >
            {(unidadVentaId) => {
              const unidadSeleccionada = unidades.find(
                (unidad) => unidad.id === unidadVentaId
              );

              if (!unidadSeleccionada) return null;

              return (
                <form.Field
                  name="stock_cantidad"
                  validators={{
                    onBlur: ({ value }) => {
                      if (!value || !value.trim()) {
                        return "El stock es obligatorio.";
                      }

                      if (!Number.isFinite(Number(value))) {
                        return "Ingresá una cantidad válida.";
                      }

                      if (Number(value) < 0) {
                        return "El stock no puede ser negativo.";
                      }

                      if (
                        unidadSeleccionada.tipo === "contable" &&
                        !Number.isInteger(Number(value))
                      ) {
                        return "El stock debe ser entero para unidades contables.";
                      }

                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div>
                      <label className="form-label">
                        Stock ({unidadSeleccionada.simbolo})
                      </label>

                      <input
                        type="number"
                        min="0"
                        step={
                          unidadSeleccionada.tipo === "contable"
                            ? "1"
                            : "0.001"
                        }
                        placeholder={
                          unidadSeleccionada.tipo === "contable"
                            ? "1"
                            : "1.256"
                        }
                        className="form-input"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value)
                        }
                      />

                      {field.state.meta.errors.map((error) => (
                        <p key={error} className="text-sm text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </form.Field>
              );
            }}
          </form.Subscribe>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
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
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? "Guardando..." : "Guardar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProductoModal;