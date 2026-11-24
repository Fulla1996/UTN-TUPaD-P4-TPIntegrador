# Food Store - Backend

**Proyecto:** Food Store  
**Asignatura:** Programación IV  
**Trabajo:** 9
**Alumno:** Fulladoza, Pablo

API REST para la gestión de productos, categorías, unidades de medida, ingredientes, pedidos y usuarios del sistema Food Store.

El backend está desarrollado con Python, FastAPI, SQLModel y PostgreSQL. Implementa autenticación mediante JWT almacenado en cookies HttpOnly, autorización basada en roles y operaciones de borrado lógico para las entidades correspondientes.


## 1. Requisitos previos

Antes de iniciar el proyecto, es necesario contar con:

- Python 3.10 o superior.
- Docker.
- Docker Compose (si se utiliza para administrar PostgreSQL).
- PostgreSQL, si no se utiliza Docker.

## 2. Crear el entorno virtual

Crear un entorno virtual para instalar las dependencias del proyecto de forma aislada.

Partiendo desde la carpeta contenedora del presente README:

**Windows:**

```bash
python -m venv .venv
```

Activar el entorno:

```bash
.venv\Scripts\activate
```

**Linux / macOS:**

```bash
python3 -m venv .venv
```

Activar el entorno:

```bash
source .venv/bin/activate
```

## 3. Instalar dependencias

Con el entorno virtual activado, ejecutar:

```bash
pip install -r requirements.txt
```

Las principales dependencias utilizadas son:

- **FastAPI:** framework para el desarrollo de la API REST.
- **SQLModel:** ORM y validación de modelos de datos.
- **Psycopg:** adaptador para la conexión con PostgreSQL.

## 4. Iniciar PostgreSQL

El proyecto utiliza PostgreSQL como sistema de gestión de base de datos.

Si se utiliza Docker, se puede iniciar un contenedor con el siguiente comando:

```bash
docker run --name postgres-tpi -e POSTGRES_USER=foodstore_user -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=food_store -p 5432:5432 -d postgres
```

Si el contenedor ya fue creado anteriormente, alcanza con iniciarlo:

```bash
docker start postgres-tpi
```

Verificar que se encuentre en ejecución:

```bash
docker ps
```

## 5. Configuración de la conexión

La conexión a PostgreSQL y los parámetros de seguridad se configuran mediante variables de entorno almacenadas en un archivo `.env`, ubicado en la raíz del backend.

Para configurar el proyecto:

1. Crear una copia del archivo `.env.example`.
2. Renombrar la copia como `.env`.
3. Completar los valores correspondientes a la conexión con PostgreSQL y la clave secreta utilizada para generar los tokens JWT.

Entre las variables utilizadas se encuentran:

- `DATABASE_URL`: URL de conexión a PostgreSQL.
- `SECRET_KEY`: clave secreta para la firma de los tokens JWT.
- `ADMIN_EMAIL`: correo electrónico del administrador inicial.
- `ADMIN_PASSWORD`: contraseña del administrador inicial.


## 6. Iniciar el backend

Con PostgreSQL en ejecución y el entorno virtual activado, ubicarse en el directorio raíz del backend y ejecutar:

```bash
fastapi dev app/main.py
```

La API quedará disponible en:

```text
http://127.0.0.1:8000
```

## 7. Endpoints disponibles

La API expone los siguientes endpoints.

### 7.1. Autenticación y usuarios

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/auth/register` | Registrar un nuevo usuario | Público |
| POST | `/auth/token` | Iniciar sesión y obtener cookie JWT | Público |
| POST | `/auth/logout` | Cerrar sesión | Autenticado |
| GET | `/auth/me` | Obtener información del usuario autenticado | Autenticado |
| GET | `/auth/admin/usuarios` | Listar usuarios | Admin |
| POST | `/auth/admin/usuarios/{id}/activar` | Activar un usuario | Admin |
| POST | `/auth/admin/usuarios/{id}/desactivar` | Desactivar un usuario | Admin |

### 7.2. Categorías

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/categorias/` | Listar categorías | Autenticado |
| GET | `/categorias/{id}` | Obtener una categoría | Autenticado |
| POST | `/categorias/` | Crear una categoría | Admin |
| PUT | `/categorias/{id}` | Actualizar una categoría | Admin |
| DELETE | `/categorias/{id}` | Eliminar una categoría | Admin |

### 7.3. Productos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/productos/` | Listar productos | Autenticado |
| GET | `/productos/{id}` | Obtener un producto | Autenticado |
| POST | `/productos/` | Crear un producto | Admin |
| PUT | `/productos/{id}` | Actualizar un producto | Admin |
| DELETE | `/productos/{id}` | Eliminar un producto | Admin |

### 7.4. Pedidos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/pedidos/` | Crear un pedido | Autenticado |
| GET | `/pedidos/` | Listar pedidos propios (o todos si es admin) | Autenticado |
| GET | `/pedidos/estados` | Obtener estados disponibles | Autenticado |
| GET | `/pedidos/{id}` | Obtener un pedido por ID | Autenticado |
| PUT | `/pedidos/{id}` | Actualizar el estado de un pedido | Admin |
| DELETE | `/pedidos/{id}` | Eliminar un pedido | Admin |

### 7.5. Ingredientes

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/ingredientes/` | Listar ingredientes, con búsqueda y paginación opcionales | Autenticado |
| GET | `/ingredientes/{id}` | Obtener un ingrediente por ID | Autenticado |
| POST | `/ingredientes/` | Crear un ingrediente | Admin |
| PUT | `/ingredientes/{id}` | Actualizar un ingrediente | Admin |
| DELETE | `/ingredientes/{id}` | Eliminar o desactivar un ingrediente | Admin |

**Parámetros opcionales de consulta para el listado:**
- `search`: permite buscar ingredientes.
- `skip`: cantidad de registros a omitir. Por defecto, `0`.
- `limit`: cantidad máxima de registros. Por defecto, `10`, con un máximo de `50`.

### 7.6. Unidades de medida

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/unidades-medida` | Listar unidades de medida disponibles | Público |

Las unidades de medida funcionan como un catálogo de consulta. No se implementan operaciones de creación, modificación ni eliminación desde la API.

**Consideraciones sobre los permisos:**

- Los endpoints de consulta requieren autenticación.
- Las operaciones de escritura sobre categorías y productos están reservadas a usuarios con rol `admin`.
- Los usuarios autenticados pueden crear pedidos. El identificador del usuario se obtiene de la sesión, no del cuerpo de la solicitud.
- Los usuarios normales solamente pueden consultar sus propios pedidos.
- Los administradores pueden consultar todos los pedidos y realizar las operaciones administrativas correspondientes.
- El registro de usuarios es público y asigna automáticamente el rol `user`.
## 8. Documentación de la API

FastAPI genera automáticamente documentación interactiva de los endpoints.

Una vez iniciado el servidor, se puede acceder a:

- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

Desde Swagger UI es posible consultar los endpoints, visualizar los esquemas de entrada y salida y ejecutar solicitudes directamente.

## 9. Base de datos y datos iniciales

Al iniciar la aplicación:

1. Se crean las tablas definidas en los modelos SQLModel, si todavía no existen.
2. Se ejecutan las cargas iniciales de los catálogos del sistema.
3. Se registran los roles `admin` y `user`.
4. Se cargan los estados correspondientes a los pedidos.
5. Se inicializa el usuario administrador, si todavía no existe y se encuentran configuradas las variables de entorno necesarias.
6. Se registran los routers correspondientes a los módulos de la API.

Los catálogos de unidades de medida, roles y estados de pedidos son de solo lectura desde la API.

El sistema utiliza borrado lógico mediante campos de fecha de baja (`deleted_at`) en las entidades correspondientes.

## 10. Pruebas de endpoints

El proyecto incluye archivos de pruebas HTTP dentro del directorio `tests/`:

```text
tests/
├── ingredientes.http
├── pedidos.http
├── productos.http
├── prueba_flujo_completo.http
└── relaciones.http
```

Para ejecutarlos se recomienda utilizar la extensión **REST Client** de Visual Studio Code.

Con el servidor iniciado, abrir cada archivo y ejecutar las solicitudes en orden, de arriba hacia abajo.

Los archivos permiten verificar:

- Operaciones CRUD de productos.
- Validaciones de datos y respuestas HTTP.
- Filtros del listado de productos.
- Baja lógica.
- Cálculo de disponibilidad de stock (`hay_stock`).
- Relaciones entre productos y categorías.
- Reglas de negocio para la asignación de categorías principales.
- Inicio y cierre de sesión.
- Registro de usuarios.
- Autenticación mediante cookies.
- Creación de categorías y productos como administrador.
- Asignación de categorías.
- Creación de pedidos como usuario autenticado.
- Consulta de pedidos.


---

## Resumen de comandos

Para iniciar el proyecto luego de haber realizado la configuración inicial:

**1. Activar el entorno virtual:**

Desde la ubicación del presente `README.md`:

```bash
.venv\Scripts\activate
```

**2. Iniciar PostgreSQL:**

```bash
docker start postgres-tpi
```

**3. Iniciar FastAPI:**

```bash
fastapi dev app/main.py
```

**4. Abrir la documentación:**

`http://127.0.0.1:8000/docs`