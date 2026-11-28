import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  CellContext,
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

import type { ProductoPublic, ProductoSortBy, SortOrder } from "@/features/productos";

interface ProductoListProps {
  productos: ProductoPublic[];
  total: number;
  paginaActual: number;
  limite: number;

  onCambiarPagina: (pagina: number) => void;
  onCambiarOrdenamiento: (
    sortBy: ProductoSortBy,
    sortOrder: SortOrder,
  ) => void;

  onEditar: (producto: ProductoPublic) => void;
  onEliminar: (id: number) => void;
  onCambiarDisponibilidad: (producto: ProductoPublic) => void;
}

function ProductoList({
  productos,
  total,
  paginaActual,
  limite,
  onCambiarPagina,
  onCambiarOrdenamiento,
  onEditar,
  onEliminar,
  onCambiarDisponibilidad,
}: ProductoListProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "id",
      desc: false,
    },
  ]);
  const columns: ColumnDef<ProductoPublic>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "categoria.nombre",
      header: "Categoría",
      enableSorting: false,
      cell: ({ row }) => row.original.categoria.nombre,
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: ({ getValue }) => getValue() || "-",
    },
    {
      accessorKey: "precio_base",
      header: "Precio",
      cell: ({ row }) =>
        `$${Number(row.original.precio_base).toFixed(2)}`,
      sortingFn: (rowA, rowB, columnId) => {
        const valorA = Number(rowA.getValue(columnId));
        const valorB = Number(rowB.getValue(columnId));

        return valorA - valorB;
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      sortingFn: (rowA, rowB, columnId) => {
        const valorA = Number(rowA.getValue(columnId));
        const valorB = Number(rowB.getValue(columnId));

        return valorA - valorB;
      },
    },
    {
      accessorKey: "disponible",
      header: "Disponible",
      cell: ({ row }) =>
        row.original.disponible ? "Sí" : "No",
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }) =>
        row.original.activo ? "Activo" : "Inactivo",
    },
    {
      id: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }: CellContext<ProductoPublic, unknown>) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEditar(row.original)}
            className="btn btn-warning"
            disabled={!row.original.activo}
          >
            Editar
          </button>

          <button
            onClick={() => onCambiarDisponibilidad(row.original)}
            className="btn btn-soft-danger"
            disabled={!row.original.activo}
          >
            {row.original.disponible ? "Deshabilitar" : "Habilitar"}
          </button>

          <button
            onClick={() => onEliminar(row.original.id)}
            className="btn btn-danger"
            disabled={!row.original.activo}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: productos,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: paginaActual - 1,
        pageSize: limite,
      },
    },
    onSortingChange: (updater) => {
      const nuevoSorting =
        typeof updater === "function"
          ? updater(sorting)
          : updater;

      setSorting(nuevoSorting);

      const ordenamiento = nuevoSorting[0];

      onCambiarOrdenamiento(
        (ordenamiento?.id ?? "nombre") as ProductoSortBy,
        ordenamiento?.desc ? "desc" : "asc",
      );
    },
    onPaginationChange: (updater) => {
      const paginacionActual: PaginationState = {
        pageIndex: paginaActual - 1,
        pageSize: limite,
      };

      const nuevaPaginacion =
        typeof updater === "function"
          ? updater(paginacionActual)
          : updater;

      onCambiarPagina(nuevaPaginacion.pageIndex + 1);
    },
    manualSorting: true,
    manualPagination: true,
    pageCount: Math.ceil(total / limite),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full border-collapse text-left text-foreground">
        <thead className="bg-surface-hover">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 font-semibold text-foreground"
                >
                  {header.isPlaceholder ? null : (
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                      disabled={!header.column.getCanSort()}
                      className="flex items-center gap-2 disabled:cursor-default"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {{
                        asc: "▲",
                        desc: "▼",
                      }[header.column.getIsSorted() as string] ?? null}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-t border-border hover:bg-surface-hover"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="btn btn-secondary py-1"
        >
          Anterior
        </button>

        <span className="text-sm text-muted">
          Página {paginaActual} de {table.getPageCount()}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="btn btn-secondary py-1"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default ProductoList;