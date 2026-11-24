import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/features/auth";
import { useThemeStore } from "@/store/themeStore";

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const navigate = useNavigate();
  const esAdmin = user?.roles.includes("admin") ?? false;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold tracking-wide">Food Store</h1>

        <div className="flex items-center gap-6">
          <Link to="/categories" className="transition hover:text-blue-300">
            Categorías
          </Link>

          <Link to="/products" className="transition hover:text-blue-300">
            Productos
          </Link>

          <Link to="/ingredientes" className="transition hover:text-blue-300">
            Ingredientes
          </Link>

          {esAdmin && (
            <Link to="/admin/users" className="transition hover:text-blue-300">
              Usuarios
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Activar modo oscuro"
                : "Activar modo claro"
            }
            title={theme === "light" ? "Modo oscuro" : "Modo claro"}
            className="rounded-md border border-slate-500 px-3 py-2 text-sm font-semibold transition hover:bg-slate-700"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {user && (
            <div className="text-right">
              <p className="font-semibold">
                {user.nombre} {user.apellido}
              </p>

              <p className="text-sm text-slate-300">
                {user.roles.join(", ")}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;