from sqlmodel import Session

from app.core.repository import BaseRepository

from .model import Usuario


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session):
        super().__init__(session, Usuario)
