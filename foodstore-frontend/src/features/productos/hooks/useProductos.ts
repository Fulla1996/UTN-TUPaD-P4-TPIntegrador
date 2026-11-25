import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { ProductoUpdate } from "../types/producto.types";

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../services/producto.service";

import { useNotificationStore } from "@/store/notificationStore";

export function useProductos() {
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const queryClient = useQueryClient();

  // Obtener productos
  const productosQuery = useQuery({
    queryKey: ["productos"],
    queryFn: obtenerProductos,
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