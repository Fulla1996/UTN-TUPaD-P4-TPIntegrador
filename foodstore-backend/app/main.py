from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.core.database import create_db_and_tables, engine
from app.core.seed import (
    seed_admin,
    seed_estados_pedido,
    seed_roles,
    seed_unidades_medida,
)
from app.modules.categorias.router import router as categorias_router
from app.modules.ingredientes.router import router as ingredientes_router
from app.modules.pedidos.router import router as pedidos_router
from app.modules.productos.router import router as productos_router
from app.modules.unidades_medida.router import router as unidades_medida_router
from app.modules.usuarios.router import router as usuarios_router

#from app.modules.categorias.model import Categoria
#from app.modules.productos.producto_categoria import ProductoCategoria
#from app.modules.unidades_medida.model import UnidadMedida
#from app.modules.productos.model import Producto
#from app.modules.usuarios.model import Rol, Usuario, UsuarioRol


@asynccontextmanager
async def lifespan(app: FastAPI):

    # Crear las tablas
    create_db_and_tables()

    # Cargar los datos iniciales
    with Session(engine) as session:
        seed_unidades_medida(session)
        seed_estados_pedido(session)
        seed_roles(session)
        seed_admin(session)

    yield


app = FastAPI(
    title="Food Store API",
    description="API para administrar el catálogo de productos de Food Store",
    version="1.0.0",
    lifespan=lifespan
)


# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():
    return {"message": "Food Store API funcionando"}

app.include_router(unidades_medida_router)
app.include_router(categorias_router)
app.include_router(productos_router)
app.include_router(ingredientes_router)
app.include_router(pedidos_router)
app.include_router(usuarios_router)