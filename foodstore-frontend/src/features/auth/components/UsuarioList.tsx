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

import type { UsuarioAdmin } from "../types/usuario.types";
import { useAuthStore } from "../../../store/authStore";

interface UsuarioListProps {
    usuarios: UsuarioAdmin[];
    onActivar: (id: number) => void;
    onDesactivar: (id: number) => void;
}

function UsuarioList({
    usuarios,
    onActivar,
    onDesactivar,
}: UsuarioListProps) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const usuarioActual = useAuthStore((state) => state.user);

    const columns: ColumnDef<UsuarioAdmin>[] = [
        {
            accessorKey: "nombre",
            header: "Nombre",
            cell: ({ row }) =>
                `${row.original.nombre} ${row.original.apellido}`,
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "celular",
            header: "Celular",
            cell: ({ row }) => row.original.celular ?? "-",
        },
        {
            accessorKey: "roles",
            header: "Roles",
            cell: ({ row }) => row.original.roles.join(", ") || "-",
        },
        {
            accessorKey: "activo",
            header: "Estado",
            cell: ({ row }) =>
                row.original.activo ? "Activo" : "Desactivado",
        },
        {
            id: "acciones",
            header: "Acciones",
            enableSorting: false,
            cell: ({ row }: CellContext<UsuarioAdmin, unknown>) => {
                const usuario = row.original;

                if (usuario.id === usuarioActual?.id) {
                    return <span className="text-muted">Sesión actual</span>;
                }

                return (
                    <div className="flex gap-2">
                        {usuario.activo ? (
                            <button
                                onClick={() => onDesactivar(usuario.id)}
                                className="btn btn-danger"
                            >
                                Desactivar
                            </button>
                        ) : (
                            <button
                                onClick={() => onActivar(usuario.id)}
                                className="btn btn-success"
                            >
                                Activar
                            </button>
                        )}
                    </div>
                );
            }
        },
    ];

    const table = useReactTable({
        data: usuarios,
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
                                            disabled={!header.column.getCanSort()}
                                            className="flex items-center gap-2 disabled:cursor-default"
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

export default UsuarioList;