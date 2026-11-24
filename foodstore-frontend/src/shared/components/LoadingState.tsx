interface LoadingStateProps {
  mensaje?: string;
}

export default function LoadingState({
  mensaje = "Cargando...",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />

      <p className="mt-4 text-sm text-muted">{mensaje}</p>
    </div>
  );
}