import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import type { RolUsuario } from "@/features/usuarios";
import { useNotificationStore } from "@/store/notificationStore";

interface ProtectedRouteProps {
  allowedRoles?: RolUsuario[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const checking = useAuthStore((state) => state.checking);

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const tienePermiso =
    !allowedRoles || (user !== null && allowedRoles.includes(user.role));

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

  if (!tienePermiso) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}