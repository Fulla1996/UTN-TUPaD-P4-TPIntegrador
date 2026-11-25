import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center shadow-md">
        <h1 className="mb-4 text-4xl font-bold text-red-600 dark:text-red-400">
          403
        </h1>

        <h2 className="mb-3 text-2xl font-semibold text-foreground">
          Acceso denegado
        </h2>

        <p className="mb-6 text-muted">
          No tenés permisos suficientes para acceder a esta sección.
        </p>

        <Link
          to="/categories"
          className="btn btn-primary inline-block"
        >
          Volver a categorías
        </Link>
      </div>
    </div>
  );
}