// Estados de los pedidos
export type EstadoPedido =
    | "PENDIENTE"
    | "EN_PREPARACION"
    | "ENTREGADO"
    | "CANCELADO";

// Formas de pago
export type FormaPago =
    | "EFECTIVO"
    | "TRANSFERENCIA";

// Importes recibidos desde el backend.
// Decimal de Python puede serializarse como string.
export type Importe = number | string;

// Crear pedido
export interface ItemPedidoCreate {
    producto_id: number;
    cantidad: number;
}

export interface PedidoCreate {
    forma_pago: FormaPago;
    direccion_entrega: string;
    notas?: string | null;
    items: ItemPedidoCreate[];
}

// Cambiar estado de un pedido
export interface CambioEstado {
    estado: EstadoPedido;
}

// Detalle de un pedido
export interface DetallePedidoRead {
    id: number;
    producto_id: number;
    cantidad: number;
    nombre_producto: string;
    precio_unitario: Importe;
    subtotal: Importe;
}

// Pedido completo
export interface PedidoRead {
    id: number;
    usuario_id: number;
    estado: EstadoPedido;
    forma_pago: FormaPago;
    direccion_entrega: string;
    notas: string | null;
    total: Importe;
    created_at: string;
    updated_at: string;
    detalles: DetallePedidoRead[];
}

// Respuesta paginada
export interface PedidosPaginados {
    total: number;
    items: PedidoRead[];
}

// Resumen administrativo
export interface ResumenPedidos {
    pendientes: number;
    en_preparacion: number;
    entregados: number;
    cancelados: number;
    pedidos_hoy: number;
    ingresos_entregados: Importe;
}