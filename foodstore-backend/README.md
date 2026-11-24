# Food Store - Backend

**Proyecto:** Food Store  
**Asignatura:** Programación IV  
**Trabajo:** Integrador Final
**Alumno:** Fulladoza, Pablo
API REST para la gestión de categorías, productos, pedidos y usuarios del sistema Food Store.

El backend está desarrollado con **Python, FastAPI, SQLModel y PostgreSQL**. Implementa autenticación mediante JWT almacenado en cookies HttpOnly, autorización basada en roles y operaciones de baja lógica para las entidades correspondientes.

La arquitectura está organizada por módulos y capas, utilizando los patrones **Repository y Unit of Work** para gestionar el acceso a datos y las transacciones.

## 1. Requisitos previos

Antes de iniciar el proyecto, es necesario contar con:

- Python 3.10 o superior.
- Docker.
- Docker Compose (opcional).
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

Las principales tecnologías utilizadas son:

- **FastAPI:** framework para el desarrollo de la API REST.
- **SQLModel:** ORM y validación de modelos de datos.
- **Psycopg:** adaptador para la conexión con PostgreSQL.
- **Bcrypt:** algoritmo utilizado para el hash de contraseñas.
- **Python-dotenv:** gestión de variables de entorno.

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

Si se utiliza una instalación local de PostgreSQL, es necesario crear previamente la base de datos y configurar correctamente los datos de conexión.

## 5. Configuración de la conexión

La conexión a PostgreSQL y los parámetros de seguridad se configuran mediante variables de entorno almacenadas en un archivo `.env`, ubicado en la raíz del backend.

Para configurar el proyecto:

1. Crear una copia del archivo `.env.example`.
2. Renombrar la copia como `.env`.
3. Completar los valores correspondientes a la conexión con PostgreSQL y la clave secreta utilizada para generar los tokens JWT.

Entre las variables utilizadas se encuentran:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL. |
| `SECRET_KEY` | Clave secreta para la firma de los tokens JWT. |
| `ADMIN_EMAIL` | Correo electrónico del administrador inicial. |
| `ADMIN_PASSWORD` | Contraseña del administrador inicial. |

La contraseña inicial del administrador debe tener al menos 8 caracteres.

## 6. Inicialización de la base de datos y datos iniciales

Antes de ejecutar el backend por primera vez, es necesario inicializar la base de datos y cargar los datos iniciales mediante el script de seed.

Con PostgreSQL en ejecución, el entorno virtual activado y las variables de entorno configuradas, ejecutar desde la carpeta raíz del backend:

```bash
python -m app.db.seed
```

El proceso realiza las siguientes operaciones:

1. Crea las tablas definidas en los modelos SQLModel, si todavía no existen.
2. Crea el usuario administrador inicial, si todavía no existe.
3. Crea las categorías iniciales:
   - Hamburguesas.
   - Pizzas.
   - Bebidas.
4. Crea los productos iniciales asociados a sus respectivas categorías.
5. Confirma los cambios mediante una transacción.

El seed es idempotente: comprueba la existencia de los registros antes de crearlos, evitando duplicaciones al ejecutarse nuevamente.

El administrador inicial se configura mediante `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el archivo `.env`.

**Importante:** el seed debe ejecutarse manualmente antes de la primera ejecución del backend. No se ejecuta automáticamente al iniciar FastAPI.

## 7. Iniciar el backend

Con PostgreSQL en ejecución, las dependencias instaladas, las variables de entorno configuradas y el seed ejecutado, ubicarse en el directorio raíz del backend y ejecutar:

```bash
fastapi dev app/main.py
```

La API quedará disponible en:

```text
http://127.0.0.1:8000
```

El prefijo general de los endpoints es:

```text
/api/v1
```

Por ejemplo:

```text
http://127.0.0.1:8000/api/v1/productos/
```

## 8. Endpoints disponibles

Todos los endpoints de la API utilizan el prefijo `/api/v1`.

### 8.1. Autenticación y usuarios

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Registrar un nuevo usuario | Público |
| POST | `/api/v1/auth/token` | Iniciar sesión y obtener cookie JWT | Público |
| POST | `/api/v1/auth/logout` | Cerrar sesión | Autenticado |
| GET | `/api/v1/auth/me` | Obtener información del usuario autenticado | Autenticado |
| GET | `/api/v1/auth/admin/usuarios` | Listar usuarios con paginación | Admin |
| POST | `/api/v1/auth/admin/usuarios/{id}/activar` | Activar un usuario | Admin |
| POST | `/api/v1/auth/admin/usuarios/{id}/desactivar` | Desactivar un usuario | Admin |

El registro de usuarios es público y asigna automáticamente el rol `user`.

La gestión de usuarios está reservada a administradores. Un administrador no puede desactivarse a sí mismo.

### 8.2. Categorías

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/v1/categorias/` | Listar categorías | Autenticado |
| GET | `/api/v1/categorias/{id}` | Obtener una categoría por ID | Autenticado |
| POST | `/api/v1/categorias/` | Crear una categoría | Admin |
| PUT | `/api/v1/categorias/{id}` | Actualizar una categoría | Admin |
| DELETE | `/api/v1/categorias/{id}` | Dar de baja una categoría | Admin |

Las categorías utilizan baja lógica mediante el campo `activo`.

La baja lógica no elimina físicamente el registro de la base de datos.

### 8.3. Productos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/v1/productos/` | Listar productos | Autenticado |
| GET | `/api/v1/productos/{id}` | Obtener un producto por ID | Autenticado |
| POST | `/api/v1/productos/` | Crear un producto | Admin |
| PATCH | `/api/v1/productos/{id}` | Actualizar información del producto | Admin |
| PATCH | `/api/v1/productos/{id}/stock` | Actualizar el stock | Admin |
| DELETE | `/api/v1/productos/{id}` | Dar de baja un producto | Admin |

Los productos utilizan baja lógica mediante el campo `activo`.

El listado permite aplicar filtros y paginación. Entre los filtros disponibles se encuentran:

- `search`: búsqueda por nombre.
- `categoria_id`: filtrar por categoría.
- `activo`: filtrar por estado de actividad.
- `disponible`: filtrar por disponibilidad.
- `skip`: cantidad de registros a omitir.
- `limit`: cantidad máxima de registros a devolver.

### 8.4. Pedidos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/v1/pedidos/` | Crear un pedido | Autenticado |
| GET | `/api/v1/pedidos/` | Listar pedidos propios o todos si es admin | Autenticado |
| GET | `/api/v1/pedidos/{id}` | Obtener un pedido por ID | Autenticado |
| PATCH | `/api/v1/pedidos/{id}` | Actualizar el estado de un pedido | Autenticado |
| GET | `/api/v1/pedidos/resumen` | Obtener el resumen estadístico de pedidos | Admin |

Los pedidos implementan las siguientes reglas de negocio:

- Los usuarios pueden crear pedidos asociados automáticamente a su cuenta.
- Los usuarios normales solamente pueden consultar sus propios pedidos.
- Los administradores pueden consultar todos los pedidos.
- Los usuarios pueden cancelar sus propios pedidos cuando se encuentran pendientes.
- Los administradores pueden gestionar las transiciones de estado permitidas.
- Al crear un pedido se verifica la disponibilidad y el stock de los productos.
- El stock se descuenta al confirmar la creación del pedido.
- Al cancelar un pedido se restituye el stock correspondiente.
- Los detalles del pedido conservan una copia del nombre y precio de los productos al momento de la compra.

Los estados disponibles son:

- `PENDIENTE`
- `EN_PREPARACION`
- `ENTREGADO`
- `CANCELADO`

El endpoint de resumen devuelve:

- Cantidad de pedidos pendientes.
- Cantidad de pedidos en preparación.
- Cantidad de pedidos entregados.
- Cantidad de pedidos cancelados.
- Cantidad de pedidos creados durante el día actual.
- Ingresos correspondientes a los pedidos entregados.

### 8.5. Consideraciones sobre los permisos

- Los endpoints de consulta de categorías, productos y pedidos requieren autenticación.
- Las operaciones de escritura sobre categorías y productos están reservadas a usuarios con rol `admin`.
- La gestión administrativa de usuarios está reservada a administradores.
- Los usuarios autenticados pueden crear pedidos.
- El identificador del usuario que realiza un pedido se obtiene de la sesión autenticada, no del cuerpo de la solicitud.
- Los usuarios normales solamente pueden consultar sus propios pedidos.
- Los administradores pueden consultar todos los pedidos y acceder al resumen estadístico.
- El registro de usuarios es público y asigna automáticamente el rol `user`.

## 9. Paginación y filtros

Los endpoints de listado que implementan paginación utilizan los parámetros:

| Parámetro | Descripción |
|---|---|
| `skip` | Cantidad de registros a omitir. |
| `limit` | Cantidad máxima de registros a devolver. |
| `search` | Búsqueda por texto, cuando está disponible. |

Las respuestas paginadas utilizan la siguiente estructura:

```json
{
  "total": 53,
  "items": [
    {
      "id": 1
    }
  ]
}
```

Donde:

- `total`: cantidad total de registros que coinciden con los filtros aplicados, independientemente de la página solicitada.
- `items`: registros correspondientes a la página actual.

Los parámetros de paginación tienen valores predeterminados y restricciones de rango validadas desde la API.

## 10. Documentación de la API

FastAPI genera automáticamente documentación interactiva de los endpoints.

Una vez iniciado el servidor, se puede acceder a:

- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

Desde Swagger UI es posible consultar los endpoints, visualizar los esquemas de entrada y salida y ejecutar solicitudes directamente.

## 11. Base de datos y arquitectura

El proyecto utiliza PostgreSQL como sistema de gestión de base de datos y SQLModel para el mapeo objeto-relacional.

La arquitectura se organiza por módulos y capas, separando responsabilidades:

- **Models:** definen las entidades y relaciones de la base de datos.
- **Schemas:** definen los datos de entrada y salida de la API.
- **Repositories:** encapsulan las operaciones de acceso a datos.
- **Services:** implementan las reglas de negocio.
- **Unit of Work:** administra las sesiones y transacciones.
- **Routers:** exponen los endpoints y gestionan las dependencias HTTP.

Se implementan los patrones Repository y Unit of Work para centralizar el acceso a datos y garantizar que las operaciones relacionadas se ejecuten dentro de una misma transacción.

Las bajas de categorías y productos se realizan de manera lógica mediante el campo `activo`, conservando los registros en la base de datos.

## 12. Pruebas de endpoints

El proyecto incluye archivos de pruebas HTTP dentro del directorio `tests/`:

```text
tests/
├── pedidos.http
├── productos.http
├── prueba_flujo_completo.http
├── relaciones.http
└── foodstore.http
```

Para ejecutarlos se recomienda utilizar la extensión **REST Client** de Visual Studio Code.

Con el servidor iniciado, abrir cada archivo y ejecutar las solicitudes en el orden correspondiente.

Los archivos permiten verificar:

- Operaciones de autenticación y autorización.
- Registro e inicio de sesión.
- Autenticación mediante cookies.
- Operaciones CRUD de categorías y productos.
- Validaciones de datos y respuestas HTTP.
- Filtros y paginación.
- Baja lógica.
- Actualización de stock.
- Creación de pedidos.
- Consulta de pedidos.
- Transiciones de estado.
- Descuento y restitución de stock.
- Reglas de acceso según el rol del usuario.
- Resumen administrativo de pedidos.

---

## Resumen de comandos

Para iniciar el proyecto luego de haber realizado la configuración inicial:

**1. Activar el entorno virtual:**

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

```text
http://127.0.0.1:8000/docs
```

**Nota:** el comando de inicialización del seed solamente debe ejecutarse antes de la primera ejecución del backend o cuando sea necesario inicializar nuevamente los datos:

```bash
python -m app.db.seed
```