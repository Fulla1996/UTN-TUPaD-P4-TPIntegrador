from sqlmodel import Session

from .database import engine


class UnitOfWork:
    def __init__(self):
        self.session: Session | None = None

    def __enter__(self):
        self.session = Session(engine, expire_on_commit=False)
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if self.session is not None:
            try:
                if exc_type is not None:
                    self.session.rollback()
                else:
                    self.session.commit()
            finally:
                self.session.close()
                self.session = None