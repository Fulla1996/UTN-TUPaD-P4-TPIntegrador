import os
from decimal import Decimal

import bcrypt
from dotenv import load_dotenv
from sqlmodel import Session, select

from app.core.database import create_db_and_tables, engine
from app.modules.categorias.model import Categoria
from app.modules.pedidos.model import Pedido  # noqa: F401
from app.modules.productos.model import Producto
from app.modules.usuarios.enums import Rol
from app.modules.usuarios.model import Usuario

load_dotenv()

def seed_admin(session: Session) -> None:
    email = os.getenv("ADMIN_EMAIL")
    password = os.getenv("ADMIN_PASSWORD")

    if not email or not password:
        raise RuntimeError(
            "ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos en el .env"
        )

    if len(password) < 8:
        raise RuntimeError(
            "La contraseña del administrador debe tener al menos 8 caracteres."
        )

    usuario = session.exec(
        select(Usuario).where(Usuario.username == "admin")
    ).first()

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
            role=Rol.ADMIN,
        )

        session.add(usuario)
        print("Administrador creado.")
    else:
        print("El administrador ya existe.")

def seed_categorias(session: Session) -> dict[str, Categoria]:
    categorias_data = [
        {
            "nombre": "Hamburguesas",
            "descripcion": "Hamburguesas artesanales y opciones clásicas.",
        },
        {
            "nombre": "Pizzas",
            "descripcion": "Pizzas elaboradas con ingredientes frescos.",
        },
        {
            "nombre": "Bebidas",
            "descripcion": "Bebidas frías para acompañar tus comidas.",
        },
    ]

    categorias: dict[str, Categoria] = {}

    for data in categorias_data:
        categoria = session.exec(
            select(Categoria).where(
                Categoria.nombre == data["nombre"]
            )
        ).first()

        if categoria is None:
            categoria = Categoria(
                nombre=data["nombre"],
                descripcion=data["descripcion"],
            )
            session.add(categoria)
            session.flush()
            print(f"Categoría creada: {categoria.nombre}")

        categorias[categoria.nombre] = categoria

    return categorias


def seed_productos(
    session: Session,
    categorias: dict[str, Categoria],
) -> None:
    productos_data = [
        {
            "categoria": "Hamburguesas",
            "nombre": "Hamburguesa Clásica",
            "descripcion": "Hamburguesa con carne, lechuga, tomate y queso.",
            "precio_base": Decimal("8500.00"),
            "stock": 20,
        },
        {
            "categoria": "Hamburguesas",
            "nombre": "Hamburguesa Doble",
            "descripcion": "Hamburguesa con doble carne y doble queso.",
            "precio_base": Decimal("11000.00"),
            "stock": 15,
        },
        {
            "categoria": "Hamburguesas",
            "nombre": "Hamburguesa BBQ",
            "descripcion": "Hamburguesa con salsa barbacoa y cebolla caramelizada.",
            "precio_base": Decimal("10500.00"),
            "stock": 12,
        },
        {
            "categoria": "Pizzas",
            "nombre": "Pizza Muzarella",
            "descripcion": "Pizza clásica con salsa de tomate y mozzarella.",
            "precio_base": Decimal("12000.00"),
            "stock": 18,
        },
        {
            "categoria": "Pizzas",
            "nombre": "Pizza Napolitana",
            "descripcion": "Pizza con mozzarella, tomate y ajo.",
            "precio_base": Decimal("13500.00"),
            "stock": 14,
        },
        {
            "categoria": "Pizzas",
            "nombre": "Pizza Especial",
            "descripcion": "Pizza con mozzarella, jamón y morrones.",
            "precio_base": Decimal("15000.00"),
            "stock": 10,
        },
        {
            "categoria": "Bebidas",
            "nombre": "Agua Mineral",
            "descripcion": "Agua mineral sin gas de 500 ml.",
            "precio_base": Decimal("1800.00"),
            "stock": 30,
        },
        {
            "categoria": "Bebidas",
            "nombre": "Gaseosa Cola",
            "descripcion": "Gaseosa cola de 500 ml.",
            "precio_base": Decimal("2500.00"),
            "stock": 25,
        },
        {
            "categoria": "Bebidas",
            "nombre": "Jugo de Naranja",
            "descripcion": "Jugo de naranja de 500 ml.",
            "precio_base": Decimal("2200.00"),
            "stock": 20,
        },
    ]

    for data in productos_data:
        nombre = data["nombre"]

        producto = session.exec(
            select(Producto).where(Producto.nombre == nombre)
        ).first()

        if producto is not None:
            print(f"El producto ya existe: {nombre}")
            continue

        categoria = categorias[data["categoria"]]

        if categoria.id is None:
            raise RuntimeError(
                f"No se pudo obtener el ID de la categoría {categoria.nombre}."
            )

        producto = Producto(
            categoria_id=categoria.id,
            nombre=nombre,
            descripcion=data["descripcion"],
            precio_base=data["precio_base"],
            stock=data["stock"],
            disponible=True,
            activo=True,
        )

        session.add(producto)
        print(f"Producto creado: {nombre}")


def seed() -> None:

    create_db_and_tables()
    with Session(engine) as session:
        try:
            seed_admin(session)
            categorias = seed_categorias(session)
            seed_productos(session, categorias)

            session.commit()
            print("\nSeed ejecutado correctamente.")

        except Exception:
            session.rollback()
            raise


if __name__ == "__main__":
    seed()