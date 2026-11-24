import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  CellContext,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";

import type { IngredientePublic } from "../types/ingrediente.types";
import { useAuthStore } from "@/features/auth";

interface IngredienteListProps {
  ingredientes: IngredientePublic[];
  onEditar: (ingrediente: IngredientePublic) => void;
  onEliminar: (id: number) => void;
}

function IngredienteList({
  ingredientes,
  onEditar,
  onEliminar,
}: IngredienteListProps) {

  const user = useAuthStore((state) => state.user);
  const esAdmin = user?.roles.includes("admin") ?? false;

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<IngredientePublic>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    ...(esAdmin
      ? [
          {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }: CellContext<IngredientePublic, unknown>) => (
              <div className="flex gap-2">
                <button
                  onClick={() => onEditar(row.original)}
                  className="btn btn-warning"
                >
                  Editar
                </button>

                <button
                  onClick={() => onEliminar(row.original.id)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  const table = useReactTable({
    data: ingredientes,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
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
                      className="flex items-center gap-2 disabled:cursor-default"
                      disabled={!header.column.getCanSort()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
                    cell.getContext()
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
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
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

export default IngredienteList;