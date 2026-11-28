import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { ProductoUpdate, ProductoSortBy, SortOrder } from "@/features/productos";

import {
  obtenerProducto,
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../services/producto.service";

import { useNotificationStore } from "@/store/notificationStore";

interface UseProductosOptions {
  skip?: number;
  limit?: number;
  activo?: boolean;
  disponible?: boolean;
  sort_by?: ProductoSortBy;
  sort_order?: SortOrder;
}

// Obtener un producto por ID
export function useProducto(productoId: number) {
  return useQuery({
    queryKey: ["producto", productoId],
    queryFn: () => obtenerProducto(productoId),
    enabled: Number.isInteger(productoId) && productoId > 0,
  });
}

export function useProductos(
  search = "",
  categoriaId: number | null = null,
  options: UseProductosOptions = {},
) {
  const {
    skip = 0,
    limit = 10,
    activo,
    disponible,
    sort_by = "nombre",
    sort_order = "asc",
  } = options;

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const queryClient = useQueryClient();

  // Obtener productos
  const productosQuery = useQuery({
    queryKey: [
      "productos",
      search,
      categoriaId,
      skip,
      limit,
      activo,
      disponible,
      sort_by,
      sort_order,
    ],
    queryFn: () =>
      obtenerProductos({
        search,
        categoria_id: categoriaId,
        skip,
        limit,
        activo,
        disponible,
        sort_by,
        sort_order,
      }),
    placeholderData: (previousData) => previousData,
  });


  // Crear producto
  const crearMutation = useMutation({
    mutationFn: crearProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification("Producto creado correctamente");
    },
  });

  // Actualizar producto
  const editarMutation = useMutation({
    mutationFn: ({
      id,
      producto,
    }: {
      id: number;
      producto: ProductoUpdate;
    }) => actualizarProducto(id, producto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification("Producto modificado correctamente");
    },
  });

  // Eliminar producto
  const eliminarMutation = useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification("Producto eliminado correctamente");
    },
  });

  // Cambiar disponibilidad
  const cambiarEstadoMutation = useMutation({
    mutationFn: ({
      id,
      producto,
    }: {
      id: number;
      producto: ProductoUpdate;
    }) => actualizarProducto(id, producto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productos"],
      });

      showNotification("Disponibilidad actualizada correctamente");
    },
  });

  return {
    productosQuery,
    crearMutation,
    editarMutation,
    eliminarMutation,
    cambiarEstadoMutation,
  };
}