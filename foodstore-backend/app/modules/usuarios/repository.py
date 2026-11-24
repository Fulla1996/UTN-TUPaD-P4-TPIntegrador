from sqlmodel import Session, select

from app.core.repository import BaseRepository

from .model import Usuario


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session):
        super().__init__(session, Usuario)

    def obtener_todos(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Usuario]:
        
        statement = select(Usuario).offset(skip).limit(limit)

        return list(self.session.exec(statement).all())
