import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import { LoginPage, RegisterPage } from "@/features/auth";
import { AdminProductosPage, CatalogoPage, DetalleProductoPage } from "@/features/productos";
import { CarritoPage, MisPedidosPage } from "@/features/pedidos";
import { AdminUsuariosPage } from "@/features/usuarios";

import { Navbar } from "@/shared";
import { UnauthorizedPage } from "@/features/auth"
import { Footer } from "@/shared/components/Footer";
import AdminLayout from "@/shared/layout/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import { AdminCategoriasPage } from "@/features/categorias";
import { AdminDashboardPage } from "@/features/dashboard";
import CatalogoLayout from "@/shared/layout/CatalogoLayout";

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
          <Route element={<CatalogoLayout />}>
            <Route path="/" element={<CatalogoPage />} />
          </Route>

          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/mis-pedidos" element={<MisPedidosPage />} />

          <Route
            path="/productos/:productoId"
            element={<DetalleProductoPage />}
          />
        </Route>
      </Route>

      {/* Rutas privadas: solamente administradores */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<AdminDashboardPage />}
          />

          <Route
            path="/admin/usuarios"
            element={<AdminUsuariosPage />}
          />
          <Route
            path="/admin/categorias"
            element={<AdminCategoriasPage />}
          />
          <Route
            path="/admin/productos"
            element={<AdminProductosPage />}
          />

          <Route
            path="/admin/pedidos"
            element={<MisPedidosPage />}
          />
        </Route>
      </Route>

      {/* Ruta inexistente */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}