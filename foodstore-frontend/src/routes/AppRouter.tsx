import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import {
  LoginPage,
  RegisterPage,
  AdminUsersPage,
} from "@/features/auth";

import { CategoriasPage } from "@/features/categorias";
import { ProductosPage } from "@/features/productos";
import { IngredientesPage } from "@/features/ingredients";

import { Navbar, UnauthorizedPage } from "@/shared/components";

import ProtectedRoute from "./ProtectedRoute";
import { Footer } from "@/shared/components/Footer";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Rutas privadas: cualquier usuario autenticado */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/categories" replace />} />
          <Route path="/categories" element={<CategoriasPage />} />
          <Route path="/products" element={<ProductosPage />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
        </Route>
      </Route>

      {/* Rutas privadas: solo ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      {/* Ruta inexistente */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}