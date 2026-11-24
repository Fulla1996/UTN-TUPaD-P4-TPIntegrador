import { create } from "zustand";

import {
  login as iniciarSesion,
  logout as cerrarSesion,
  obtenerUsuarioActual,
} from "@/features/auth/services/auth.service";

import type { UsuarioAuth } from "../types/usuario.types";

interface AuthState {
  user: UsuarioAuth | null;
  checking: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  setUser: (user: UsuarioAuth | null) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
      user: null,
      checking: true,

      login: async (email, password) => {
        await iniciarSesion(email, password);

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
    }));