from typing import Generic, TypeVar

from sqlmodel import Session, SQLModel, select

ModelType = TypeVar("ModelType", bound=SQLModel)


class BaseRepository(Generic[ModelType]):
    def __init__(self, session: Session, model: type[ModelType]):
        self.session = session
        self.model = model

    def get(self, id: int) -> ModelType | None:
        return self.session.get(self.model, id)

    def get_all(self) -> list[ModelType]:
        return list(self.session.exec(select(self.model)).all())

    def create(self, entity: ModelType) -> ModelType:
        self.session.add(entity)
        self.session.flush()
        return entity

    def update(self, entity: ModelType) -> ModelType:
        self.session.add(entity)
        self.session.flush()
        return entity

    def delete(self, entity: ModelType) -> None:
        self.session.delete(entity)
        self.session.flush()

