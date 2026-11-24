from .exceptions import CategoriaDesactivada, NombreDuplicado
from .model import Categoria
from .schema import CategoriaCreate, CategoriaUpdate
from .unit_of_work import CategoriaUnitOfWork


def crear(data: CategoriaCreate) -> Categoria:
    with CategoriaUnitOfWork() as uow:
        nombre = data.nombre.strip()

        if uow.categorias.existe_nombre(nombre):
            raise NombreDuplicado(f"Categoría {nombre} ya existe")

        nueva = Categoria(
            nombre=nombre,
            descripcion=data.descripcion,
        )

        uow.categorias.create(nueva)

    return nueva


def obtener_todas(
    activo: bool | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 10,
) -> list[Categoria]:
    with CategoriaUnitOfWork() as uow:
        categorias = uow.categorias.obtener_todas(
            activo=activo,
            search=search,
            skip=skip,
            limit=limit,
        )

    return categorias


def obtener_por_id(categoria_id: int) -> Categoria | None:
    with CategoriaUnitOfWork() as uow:
        categoria = uow.categorias.get(categoria_id)

    return categoria


def actualizar(
    categoria_id: int,
    data: CategoriaUpdate,
) -> Categoria | None:
    with CategoriaUnitOfWork() as uow:
        categoria = uow.categorias.get(categoria_id)

        if categoria is None:
            return None

        if not categoria.activo:
            raise CategoriaDesactivada(
                "Categoría ya desactivada, no puede actualizarse"
            )

        cambios = data.model_dump(exclude_unset=True)

        if not cambios:
            return categoria

        if "nombre" in cambios:
            if cambios["nombre"] is None:
                raise ValueError("El nombre no puede ser nulo.")

            nombre = cambios["nombre"].strip()

            if len(nombre) < 3:
                raise ValueError("El nombre debe tener al menos 3 caracteres.")

            if uow.categorias.existe_nombre(
                nombre,
                excluir_id=categoria_id,
            ):
                raise NombreDuplicado(
                    "No se puede editar categoría con un nombre utilizado por otra"
                )

            cambios["nombre"] = nombre

        for key, value in cambios.items():
            setattr(categoria, key, value)

        uow.categorias.update(categoria)

    return categoria


def desactivar(categoria_id: int) -> Categoria | None:
    with CategoriaUnitOfWork() as uow:
        categoria = uow.categorias.get(categoria_id)

        if categoria is None:
            return None

        if not categoria.activo:
            raise CategoriaDesactivada("La categoría ya se encuentra desactivada.")

        categoria.activo = False

        uow.categorias.update(categoria)

    return categoria
