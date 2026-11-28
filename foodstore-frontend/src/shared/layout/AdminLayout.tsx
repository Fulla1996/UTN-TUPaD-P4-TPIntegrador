import { Outlet, Link } from "react-router-dom";

import { Layout } from "@/shared"
import { ThemeToggleConMensaje } from "@/shared"
import { Sidebar } from "@/shared";
import { SidebarItem } from "@/shared";

import { useAuthStore } from "@/store";

const elementosMenu = [
    {
        label: "Dashboard",
        to: "/admin",
        icon: "📊",
        end: true,
    },
    {
        label: "Productos",
        to: "/admin/productos",
        icon: "📦",
    },
    {
        label: "Categorías",
        to: "/admin/categorias",
        icon: "🏷️",
    },
    {
        label: "Pedidos",
        to: "/admin/pedidos",
        icon: "🛒",
    },
    {
        label: "Usuarios",
        to: "/admin/usuarios",
        icon: "👥",
    },
];

function AdminLayout() {
    const usuario = useAuthStore((state) => state.user);

    return (
        <Layout
            sidebar={
                <Sidebar
                    title="Food Store"
                    footer={

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {usuario?.full_name}
                                </p>
                                <p className="text-xs text-muted">
                                    Administrador
                                </p>
                            </div>

                            <Link
                                to="/"
                                className="block text-sm text-muted transition hover:text-foreground"
                            >
                                ← Volver a la tienda
                            </Link>
                            <ThemeToggleConMensaje />
                        </div>
                    }
                >
                    {elementosMenu.map((item) => (
                        <SidebarItem
                            key={item.to}
                            label={item.label}
                            to={item.to}
                            icon={item.icon}
                            end={item.end}
                        />
                    ))}
                </Sidebar>
            }
        >
            <div className="p-5 sm:p-8">
                <Outlet />
            </div>
        </Layout>
    );
}

export default AdminLayout;