import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  login as iniciarSesion,
  logout as cerrarSesion,
  obtenerUsuarioActual,
} from "@/features/auth/services/auth.service";

import type { UsuarioAuth } from "@/features/auth";

interface AuthState {
  user: UsuarioAuth | null;
  checking: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  setUser: (user: UsuarioAuth | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      checking: true,

      login: async (username, password) => {
        await iniciarSesion(username, password);

        const user = await obtenerUsuarioActual();

        set({ user, checking: false });
      },

      logout: async () => {
        try {
          await cerrarSesion();
        } finally {
          set({ user: null, checking: false });
        }
      },

      checkSession: async () => {
        try {
          const user = await obtenerUsuarioActual();

          set({ user, checking: false });
        } catch {
          set({ user: null, checking: false });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: "food-store-auth",
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);