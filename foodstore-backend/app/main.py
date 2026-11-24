

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.categorias.router import router as categorias_router
from app.modules.pedidos.router import router as pedidos_router
from app.modules.productos.router import router as productos_router
from app.modules.usuarios.router import router as usuarios_router

app = FastAPI(
    title="Food Store API",
    description="API para administrar el catálogo de productos de Food Store",
    version="1.0.0",
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

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(categorias_router)
api_router.include_router(productos_router)
api_router.include_router(pedidos_router)
api_router.include_router(usuarios_router)

app.include_router(api_router)