import { Outlet } from "react-router-dom";

import { Layout, Sidebar, ThemeToggleConMensaje } from "@/shared";

import { useAuthStore } from "@/store";

import { CategoriaMenu } from "@/features/categorias";
import { useState } from "react";

interface CatalogoLayoutContext {
    categoriaId: number | null;
    setCategoriaId: (categoriaId: number | null) => void;
}

function CatalogoLayout() {
    const usuario = useAuthStore((state) => state.user);

    const [categoriaId, setCategoriaId] = useState<number | null>(null);

    const context: CatalogoLayoutContext = {
        categoriaId,
        setCategoriaId,
    };

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
                                    Cliente
                                </p>
                            </div>

                            <ThemeToggleConMensaje />
                        </div>
                    }
                >
                    <CategoriaMenu
                        categoriaId={categoriaId}
                        onChangeCategoria={setCategoriaId}
                    />
                </Sidebar>
            }
        >
            <div className="p-5 sm:p-8">
                <Outlet context={context} />
            </div>
        </Layout>
    );
}

export type { CatalogoLayoutContext };

export default CatalogoLayout;