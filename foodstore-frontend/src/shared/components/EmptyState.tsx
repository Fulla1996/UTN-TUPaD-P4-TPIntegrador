interface EmptyStateProps {
  mensaje?: string;
}

export default function EmptyState({
  mensaje = "No hay resultados para mostrar.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-muted">{mensaje}</p>
    </div>
  );
}