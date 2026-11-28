// Pages
export { default as AdminProductosPage } from "./pages/AdminProductosPage";
export { default as CatalogoPage } from "./pages/CatalogoPage"
export { default as DetalleProductoPage } from "./pages/DetalleProductoPage"

// Components
export { default as ProductoCard } from "./components/ProductoCard";
export { default as ProductoList } from "./components/ProductoList";
export { default as ProductoModal } from "./components/ProductoModal";

// Hooks
export { useProductos, useProducto } from "./hooks/useProductos";

// Types
export type * from "./types/producto.types";

// Service
export { obtenerProducto } from "./services/producto.service"
