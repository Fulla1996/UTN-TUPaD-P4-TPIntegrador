import type { ReactNode } from "react";

interface DashboardCardProps {
    titulo: string;
    valor: string | number;
    descripcion?: string;
    icono?: ReactNode;
}

function DashboardCard({
    titulo,
    valor,
    descripcion,
    icono,
}: DashboardCardProps) {
    return (
        <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted">
                        {titulo}
                    </p>

                    <p className="text-2xl font-bold text-foreground">
                        {valor}
                    </p>
                </div>

                {icono && (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl text-primary">
                        {icono}
                    </div>
                )}
            </div>

            {descripcion && (
                <p className="mt-4 text-xs text-muted">
                    {descripcion}
                </p>
            )}
        </article>
    );
}

export default DashboardCard;