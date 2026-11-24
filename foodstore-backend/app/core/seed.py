import os

import bcrypt
from sqlmodel import Session, select

from app.modules.pedidos.model import EstadoPedido
from app.modules.unidades_medida.model import TipoUnidad, UnidadMedida
from app.modules.usuarios.model import Usuario


def seed_unidades_medida(session: Session) -> None:

    # Comprobamos si ya existen unidades cargadas
    unidad_existente = session.exec(select(UnidadMedida)).first()

    # Si existe al menos una, no hacemos nada
    if unidad_existente is not None:
        return

    # Unidades iniciales
    unidades = [
        UnidadMedida(nombre="kilogramo", simbolo="kg", tipo=TipoUnidad.PESO),
        UnidadMedida(nombre="gramo", simbolo="g", tipo=TipoUnidad.PESO),
        UnidadMedida(nombre="litro", simbolo="L", tipo=TipoUnidad.VOLUMEN),
        UnidadMedida(nombre="mililitro", simbolo="mL", tipo=TipoUnidad.VOLUMEN),
        UnidadMedida(nombre="pieza", simbolo="u", tipo=TipoUnidad.CONTABLE),
        UnidadMedida(nombre="docena", simbolo="doc", tipo=TipoUnidad.CONTABLE),
    ]

    # Insertamos todas las unidades
    session.add_all(unidades)
    session.commit()

def seed_admin(session: Session) -> None:
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")

    if not email or not password:
        raise RuntimeError(
            "Se deben configurar ADMIN_EMAIL y ADMIN_PASSWORD en el archivo .env"
        )

    if len(password) < 8:
        raise RuntimeError(
            "La contraseña del administrador debe tener al menos 8 caracteres"
        )

    # Buscar el usuario administrador
    usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()

    # Si no existe, crearlo
    if usuario is None:
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(rounds=12),
        ).decode("utf-8")

        usuario = Usuario(
            username="admin",
            full_name="Administrador del sistema",
            email=email,
            hashed_password=hashed_password,
            role="admin"
        )

        session.add(usuario)
        session.flush()

    if usuario.id is None:
        raise RuntimeError("No se pudo obtener el ID del administrador")


    session.commit()


def seed_estados_pedido(session: Session) -> None:
    estados = [
        EstadoPedido(
            nombre="PENDIENTE",
            descripcion="Pedido pendiente de confirmación",
        ),
        EstadoPedido(
            nombre="CONFIRMADO",
            descripcion="Pedido confirmado",
        ),
        EstadoPedido(
            nombre="EN_PREPARACION",
            descripcion="Pedido en preparación",
        ),
        EstadoPedido(
            nombre="EN_CAMINO",
            descripcion="Pedido en camino",
        ),
        EstadoPedido(
            nombre="ENTREGADO",
            descripcion="Pedido entregado",
        ),
        EstadoPedido(
            nombre="CANCELADO",
            descripcion="Pedido cancelado",
        ),
    ]

    for estado in estados:
        estado_existente = session.exec(
            select(EstadoPedido).where(EstadoPedido.nombre == estado.nombre)
        ).first()

        if estado_existente is None:
            session.add(estado)

    session.commit()
