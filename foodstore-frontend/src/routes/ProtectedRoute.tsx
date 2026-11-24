import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/features/auth";
import { useNotificationStore } from "@/store/notificationStore";
import { useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const checking = useAuthStore((state) => state.checking);

  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );

  const tienePermiso =
    !allowedRoles ||
    allowedRoles.some((role) => user?.roles.includes(role));

  useEffect(() => {
    if (!checking && user && !tienePermiso) {
      showNotification("No tenés permisos para acceder a esta página.");
    }
  }, [checking, user, tienePermiso, showNotification]);
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Verificando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!tienePermiso)
  {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}