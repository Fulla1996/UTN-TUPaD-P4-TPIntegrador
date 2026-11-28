import { useAuthStore } from "@/store";

export function useAuth() {
    const user = useAuthStore((state) => state.user);
    const checking = useAuthStore((state) => state.checking);

    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);
    const checkSession = useAuthStore((state) => state.checkSession);

    return {
        user,
        checking,
        login,
        logout,
        checkSession,
    };
}