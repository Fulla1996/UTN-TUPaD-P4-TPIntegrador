// Pages
export { default as AdminProductosPage } from "./pages/AdminProductosPage";

// Components
export { default as ProductoCard } from "./components/ProductoCard";
export { default as ProductoList } from "./components/ProductoList";
export { default as ProductoModal } from "./components/ProductoModal";

// Hooks
export { useProductos } from "./hooks/useProductos";

// Types
export type * from "./types/producto.types";

export { obtenerProducto } from "./services/producto.service"