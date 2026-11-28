import { api } from "@/shared/api/axiosInstance";
import type { UsuarioAuth } from "@/features/usuarios";

export async function login(username: string, password: string): Promise<void> {
  const formData = new URLSearchParams();

  formData.append("username", username);
  formData.append("password", password);

  await api.post("/auth/token", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function obtenerUsuarioActual(): Promise<UsuarioAuth> {
  const response = await api.get<UsuarioAuth>("/auth/me");

  return response.data;
}

export async function registrar(data: {
  username: string;
  full_name: string;
  email: string;
  password: string;
}): Promise<UsuarioAuth> {
  const response = await api.post<UsuarioAuth>(
    "/auth/register",
    data,
  );

  return response.data;
}