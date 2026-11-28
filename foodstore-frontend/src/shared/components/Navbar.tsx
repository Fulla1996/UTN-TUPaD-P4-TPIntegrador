import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { ThemeToggle } from "@/shared";

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const cantidadTotal = useCartStore((state) => state.cantidadTotal());

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-wide">
          Food Store
        </Link>

        <div className="flex flex-wrap items-center gap-6">
          <Link to="/" className="transition hover:text-blue-300">
            Catálogo
          </Link>

          {user && (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin/"
                  className="transition hover:text-blue-300"
                >
                  Panel admin
                </Link>
              )}

              <Link
                to="/carrito"
                className="relative transition hover:text-blue-300"
              >
                Carrito

                {cantidadTotal > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {cantidadTotal}
                  </span>
                )}
              </Link>

              <Link
                to="/mis-pedidos"
                className="transition hover:text-blue-300"
              >
                Mis pedidos
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <>
              <div className="text-right">
                <p className="font-semibold">{user.full_name}</p>
                <p className="text-sm text-slate-300">
                  {user.role}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="transition hover:text-blue-300"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-700"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;