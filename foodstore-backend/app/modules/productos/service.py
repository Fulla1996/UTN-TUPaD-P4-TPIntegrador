from ..categorias.exceptions import CategoriaDesactivada, CategoriaNoExiste
from .exceptions import (
    NombreDuplicado,
    ProductoDesactivado,
)
from .model import Producto
from .repository import *
from .schema import ProductoCreate, ProductoUpdate
from .unit_of_work import ProductoUnitOfWork


def crear(data: ProductoCreate) -> Producto:
    with ProductoUnitOfWork() as uow:
        if uow.session is None:
            raise RuntimeError("No se pudo inicializar la sesión")

        nombre = data.nombre.strip()

        categoria = uow.categorias.get(data.categoria_id)

        if categoria is None:
            raise CategoriaNoExiste("La categoría seleccionada no existe.")

        if not categoria.activo:
            raise CategoriaDesactivada(
                "No se puede crear un producto en una categoría desactivada."
            )

        if uow.productos.existe_nombre(nombre):
            raise NombreDuplicado(f"El producto {nombre} ya existe.")

        nuevo = Producto(
            **data.model_dump(exclude={"nombre"}),
            nombre=nombre,
        )

        uow.productos.create(nuevo)

    return nuevo


def obtener_todos(
    skip: int = 0,
    limit: int = 10,
    activo: bool | None = None,
    disponible: bool | None = None,
    categoria_id: int | None = None,
    search: str | None = None,
    hay_stock: bool | None = None,
) -> list[Producto]:
    with ProductoUnitOfWork() as uow:
        productos = uow.productos.obtener_todos(
            skip=skip,
            limit=limit,
            activo=activo,
            disponible=disponible,
            categoria_id=categoria_id,
            search=search,
            hay_stock=hay_stock,
        )

    return productos


def obtener_por_id(producto_id: int) -> Producto | None:
    with ProductoUnitOfWork() as uow:
        producto = uow.productos.get(producto_id)

    return producto


def actualizar(
    producto_id: int,
    data: ProductoUpdate,
) -> Producto | None:
    with ProductoUnitOfWork() as uow:
        if uow.session is None:
            raise RuntimeError("No se pudo inicializar la sesión")

        producto = uow.productos.get(producto_id)

        if producto is None:
            return None

        if not producto.activo:
            raise ProductoDesactivado("No se puede actualizar un producto no activo.")

        cambios = data.model_dump(exclude_unset=True)

        if not cambios:
            return producto

        if "nombre" in cambios:
            if cambios["nombre"] is None:
                raise ValueError("El nombre no puede ser nulo.")

            cambios["nombre"] = cambios["nombre"].strip()

            if not cambios["nombre"]:
                raise ValueError("El nombre no puede estar vacío.")

            if uow.productos.existe_nombre(
                cambios["nombre"],
                excluir_id=producto_id,
            ):
                raise NombreDuplicado(f"El producto {cambios['nombre']} ya existe.")

        if "precio_base" in cambios and cambios["precio_base"] is None:
            raise ValueError("El precio no puede ser nulo.")

        if "categoria_id" in cambios:
            if cambios["categoria_id"] is None:
                raise ValueError("La categoría no puede ser nula.")

            categoria = uow.categorias.get(
                cambios["categoria_id"],
            )

            if categoria is None:
                raise CategoriaNoExiste("La categoría seleccionada no existe.")

            if not categoria.activo:
                raise CategoriaDesactivada(
                    "No se puede asignar un producto a una categoría desactivada."
                )

        for key, value in cambios.items():
            setattr(producto, key, value)

        uow.productos.update(producto)

    return producto


def actualizar_stock(producto_id: int, nuevo_stock: int) -> Producto | None:
    with ProductoUnitOfWork() as uow:
        producto = uow.productos.get(producto_id)

        if producto is None:
            return None

        if not producto.activo:
            raise ProductoDesactivado(
                "No se puede modificar el stock de un producto desactivado."
            )

        producto.stock = nuevo_stock

        uow.productos.update(producto)

    return producto


def desactivar(producto_id: int) -> Producto | None:
    with ProductoUnitOfWork() as uow:
        producto = uow.productos.get(producto_id)

        if producto is None:
            return None

        if not producto.activo:
            raise ProductoDesactivado("El producto ya se encuentra desactivado.")

        producto.activo = False

        uow.productos.update(producto)

    return producto
