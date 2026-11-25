import axios from "axios";

import { api } from "./axiosInstance";
import { useNotificationStore } from "@/store/notificationStore";

export function setupInterceptors() {
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (axios.isAxiosError(error)) {
                const url = error.config?.url ?? "";
                const status = error.response?.status;

                const detalle = error.response?.data?.detail;

                error.message =
                    typeof detalle === "string"
                        ? detalle
                        : "Ocurrió un error inesperado. Intentá nuevamente.";

                // Manejo de sesión expirada o token inválido
                if (status === 401) {
                    const esLogin = url.includes("/auth/token");
                    const esVerificarSesion = url.includes("/auth/me");

                    if (!esLogin && !esVerificarSesion) {
                        const { useAuthStore } = await import(
                            "@/features/auth"
                        );

                        useAuthStore.getState().setUser(null);
                    }
                }

                // Manejo de permisos insuficientes
                if (status === 403) {
                    useNotificationStore
                        .getState()
                        .showNotification(
                            "No tenés permisos para realizar esta acción."
                        );
                }
            }

            return Promise.reject(error);
        }
    );
}