import bcrypt
from sqlmodel import select

from app.modules.usuarios.enums import Rol

from ...core.security import verificar_password
from .exceptions import (
    EmailDuplicado,
    NoPuedeDesactivarseASiMismo,
    UserNameDuplicado,
    UsuarioDesactivado,
    UsuarioNoEncontrado,
    UsuarioYaActivo,
)
from .model import Usuario
from .schema import UsuarioCreate
from .unit_of_work import UsuarioUnitOfWork


def registrar(data: UsuarioCreate) -> Usuario:
    with UsuarioUnitOfWork() as uow:
        if uow.session is None:
            raise RuntimeError("La sesión se cerró inesperadamente")

        email = str(data.email).lower()
        username = str(data.username).lower()

        email_existente = uow.session.exec(
            select(Usuario).where(Usuario.email == email)
        ).first()

        username_existente = uow.session.exec(
            select(Usuario).where(Usuario.username == username)
        ).first()

        if email_existente is not None:
            raise EmailDuplicado(f"Ya existe un usuario con el email {email}")

        if username_existente is not None:
            raise UserNameDuplicado(f"Ya existe un usuario con el username {username}")

        password_hash = bcrypt.hashpw(
            data.password.encode("utf-8"),
            bcrypt.gensalt(rounds=12),
        ).decode("utf-8")

        usuario = Usuario(
            username=data.username,
            full_name=data.full_name,
            email=email,
            hashed_password=password_hash,
            role=Rol.USER,
            disabled=False,
        )

        uow.usuarios.create(usuario)

        if usuario.id is None:
            raise RuntimeError("No se pudo generar el ID del usuario")

    return usuario


def obtener_por_email(email: str) -> Usuario:
    email = email.lower()
    with UsuarioUnitOfWork() as uow:
        if uow.session is None:
            raise RuntimeError("La sesión se cerró inesperadamente")

        usuario = uow.session.exec(
            select(Usuario).where(Usuario.email == email)
        ).first()

        if usuario is None:
            raise UsuarioNoEncontrado(f"No existe un usuario con el email {email}")

        return usuario


def obtener_por_id(usuario_id: int) -> Usuario:
    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get(usuario_id)

        if usuario is None:
            raise UsuarioNoEncontrado(f"No existe un usuario con ID {usuario_id}")

        return usuario


def obtener_por_username(username: str) -> Usuario:
    username = username.lower()
    with UsuarioUnitOfWork() as uow:
        if uow.session is None:
            raise RuntimeError("La sesión se cerró inesperadamente")

        usuario = uow.session.exec(
            select(Usuario).where(Usuario.username == username)
        ).first()

        if usuario is None:
            raise UsuarioNoEncontrado(f"No existe un usuario con el username {username}")

        return usuario


def obtener_todos(skip: int = 0, limit: int = 20) -> list[Usuario]:
    with UsuarioUnitOfWork() as uow:
        usuarios = uow.usuarios.obtener_todos(skip=skip, limit=limit)

        return usuarios


def activar(usuario_id: int) -> Usuario:
    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get(usuario_id)

        if usuario is None:
            raise UsuarioNoEncontrado(f"No existe un usuario con ID {usuario_id}")

        if not usuario.disabled:
            raise UsuarioYaActivo("El usuario ya se encuentra activo")

        usuario.disabled = False

        return uow.usuarios.update(usuario)


def desactivar(usuario_id: int, admin_id: int) -> Usuario:
    if usuario_id == admin_id:
        raise NoPuedeDesactivarseASiMismo(
            "El administrador no puede desactivarse a sí mismo."
        )
    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get(usuario_id)

        if usuario is None:
            raise UsuarioNoEncontrado(f"No existe un usuario con ID {usuario_id}")

        if usuario.disabled:
            raise UsuarioDesactivado("El usuario ya se encuentra desactivado")

        usuario.disabled = True

        return uow.usuarios.update(usuario)


def autenticar(username: str, password: str) -> Usuario:
    try:
        usuario = obtener_por_username(username)
    except UsuarioNoEncontrado:
        raise UsuarioNoEncontrado("Credenciales incorrectas")

    if not verificar_password(password, usuario.hashed_password):
        raise UsuarioNoEncontrado("Credenciales incorrectas")

    if usuario.disabled:
        raise UsuarioDesactivado("Cuenta de usuario desactivada")

    return usuario
