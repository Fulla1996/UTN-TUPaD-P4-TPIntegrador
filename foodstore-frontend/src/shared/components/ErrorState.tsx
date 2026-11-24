interface ErrorStateProps {
  mensaje?: string;
  onReintentar?: () => void;
}

export default function ErrorState({
  mensaje = "No se pudieron cargar los datos.",
  onReintentar,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-red-600 dark:text-red-400">{mensaje}</p>

      {onReintentar && (
        <button
          onClick={onReintentar}
          className="btn btn-secondary mt-4"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}