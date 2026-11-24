from app.core.unit_of_work import UnitOfWork

from .repository import (
    UsuarioRepository,
)


class UsuarioUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()

        if self.session is None:
            raise RuntimeError("No se pudo inicializar la sesión")

        self.usuarios = UsuarioRepository(self.session)
        return self