import bcrypt
from sqlmodel import select

from ...core.security import verificar_password
from .exceptions import (
    EmailDuplicado,
    UserNameDuplicado,
    UsuarioDesactivado,
    UsuarioNoEncontrado,
    UsuarioYaActivo,
)
from .model import Usuario
from .schema import UsuarioCreate, UsuarioPublic
from .unit_of_work import UsuarioUnitOfWork


def registrar(data: UsuarioCreate) -> UsuarioPublic:
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
            role="user",
            disabled=False,
        )

        uow.usuarios.create(usuario)

        if usuario.id is None:
            raise RuntimeError("No se pudo generar el ID del usuario")

        usuario_publico = _convertir_a_publico(usuario)

    return usuario_publico


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


def obtener_todos() -> list[UsuarioPublic]:
    with UsuarioUnitOfWork() as uow:
        usuarios = uow.usuarios.get_all()

        return [_convertir_a_publico(usuario) for usuario in usuarios]


def activar(usuario_id: int) -> Usuario:
    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get(usuario_id)

        if usuario is None:
            raise UsuarioNoEncontrado(f"No existe un usuario con ID {usuario_id}")

        if not usuario.disabled:
            raise UsuarioYaActivo("El usuario ya se encuentra activo")

        usuario.disabled = False

        return uow.usuarios.update(usuario)


def desactivar(usuario_id: int) -> Usuario:
    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get(usuario_id)

        if usuario is None:
            raise UsuarioNoEncontrado(f"No existe un usuario con ID {usuario_id}")

        if usuario.disabled:
            raise UsuarioDesactivado("El usuario ya se encuentra desactivado")

        usuario.disabled = True

        return uow.usuarios.update(usuario)


def autenticar(email: str, password: str) -> Usuario:
    try:
        usuario = obtener_por_email(email)
    except UsuarioNoEncontrado:
        raise UsuarioNoEncontrado("Credenciales incorrectas")

    if not verificar_password(password, usuario.hashed_password):
        raise UsuarioNoEncontrado("Credenciales incorrectas")

    if usuario.disabled:
        raise UsuarioDesactivado("Cuenta de usuario desactivada")

    return usuario


def obtener_publico(usuario_id: int) -> UsuarioPublic:
    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get(usuario_id)

        if usuario is None:
            raise UsuarioNoEncontrado(f"No existe un usuario con ID {usuario_id}")

        return _convertir_a_publico(usuario)


def _convertir_a_publico(usuario: Usuario) -> UsuarioPublic:
    if usuario.id is None:
        raise RuntimeError("El usuario no tiene ID generado")

    return UsuarioPublic(
        id=usuario.id,
        username=usuario.username,
        full_name=usuario.full_name,
        email=usuario.email,
        created_at=usuario.created_at,
        disabled=usuario.disabled,
        role=usuario.role,
    )
