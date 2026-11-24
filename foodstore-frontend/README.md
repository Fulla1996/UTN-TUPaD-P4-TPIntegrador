# Food Store - Frontend

**Proyecto:** Food Store  
**Asignatura:** Programación IV  
**Trabajo:** 10
**Alumno:** Fulladoza, Pablo

Aplicación frontend para la gestión de Food Store, desarrollada con React, TypeScript, Vite y Tailwind CSS 4.

El sistema permite gestionar categorías, productos e ingredientes, consultar sus respectivos listados y administrar usuarios. También incorpora autenticación mediante JWT almacenado en cookies HttpOnly y autorización basada en roles.

La aplicación consume los endpoints REST desarrollados en FastAPI.

## 1. Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS 4
- Axios
- Zustand
- TanStack Query
- TanStack Form
- TanStack Table
- React Router

## 2. Requisitos previos

Antes de ejecutar el proyecto, es necesario contar con:

- Node.js instalado.
- pnpm instalado.
- Backend de Food Store instalado y funcionando.
- PostgreSQL configurado y en ejecución.

El backend debe encontrarse disponible en:

`http://localhost:8000`

## 3. Estructura del proyecto

La estructura principal del frontend se organiza mediante una arquitectura basada en funcionalidades (*Feature-Based Architecture*).

```text
foodstore-frontend/
│
├── src/
│   ├── assets/
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── ingredients/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   └── products/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/
│   │       ├── services/
│   │       ├── types/
│   │       └── index.ts
│   │
│   ├── routes/
│   │   ├── AppRouter.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── shared/
│   │   ├── api/
│   │   │   ├── api.ts
│   │   │   └── setupInterceptors.ts
│   │   │
│   │   └── components/
│   │       ├── EmptyState.tsx
│   │       ├── ErrorState.tsx
│   │       ├── Footer.tsx
│   │       ├── LoadingState.tsx
│   │       ├── Navbar.tsx
│   │       ├── ThemeProvider.tsx
│   │       ├── Toast.tsx
│   │       ├── UnauthorizedPage.tsx
│   │       └── index.ts
│   │
│   ├── store/
│   │   ├── notificationStore.ts
│   │   └── themeStore.ts
│   │
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── vite.config.ts
```

### Organización de carpetas

- **features:** agrupa las funcionalidades principales del sistema. Cada funcionalidad contiene sus propios componentes, hooks, páginas, servicios, tipos y un archivo `index.ts` que centraliza sus exportaciones.
- **features/auth:** contiene la lógica de autenticación, registro, inicio y cierre de sesión, además de la administración de usuarios.
- **features/categories:** contiene los componentes y operaciones relacionadas con la gestión de categorías.
- **features/products:** contiene los componentes y operaciones relacionadas con productos y unidades de medida.
- **features/ingredients:** contiene los componentes y operaciones relacionadas con ingredientes.
- **routes:** contiene la configuración de navegación y protección de rutas según la autenticación y los roles del usuario.
- **shared:** contiene recursos reutilizables entre distintas funcionalidades, incluyendo componentes visuales y la configuración centralizada de Axios.
- **store:** contiene los stores globales de Zustand destinados a la administración del tema visual y las notificaciones.
- **assets:** contiene imágenes y recursos estáticos utilizados por la aplicación.
## 4. Instalación

Para instalar y ejecutar el proyecto, primero se debe abrir una terminal y ubicarse en el directorio raíz del frontend.

Por ejemplo, si la carpeta del proyecto se encuentra dentro de `TP7`:

**Windows (PowerShell):**

```powershell
cd "ruta\TP7\foodstore-frontend"
```

Una vez ubicado en la carpeta `foodstore-frontend`, ejecutar:

```bash
pnpm install
```

Este comando instala todas las dependencias declaradas en `package.json`.

## 5. Ejecución

Con las dependencias instaladas, ejecutar:

```bash
pnpm dev
```

Vite iniciará el servidor de desarrollo y mostrará en la terminal la dirección local para acceder a la aplicación.

Generalmente:

`http://localhost:5173`

Abrir esa dirección en el navegador.

**Importante:** el backend debe estar ejecutándose previamente para que la aplicación pueda realizar las consultas y operaciones correspondientes.

## 6. Funcionalidades implementadas

La aplicación permite gestionar distintas entidades del sistema, además de incorporar autenticación y control de acceso.

### Gestión de categorías

- Listado de categorías existentes.
- Alta de nuevas categorías.
- Edición de categorías.
- Eliminación de categorías.
- Visualización de estados de carga, error y listado vacío.

### Gestión de productos

- Listado de productos existentes.
- Alta de nuevos productos.
- Edición de productos.
- Eliminación de productos.
- Asignación de categorías.
- Visualización de estados de carga, error y listado vacío.

### Gestión de ingredientes

- Listado de ingredientes existentes.
- Alta de nuevos ingredientes.
- Edición de ingredientes.
- Eliminación de ingredientes.
- Consulta de unidades de medida disponibles.

### Autenticación

- Registro de nuevos usuarios.
- Inicio de sesión mediante correo electrónico y contraseña.
- Cierre de sesión.
- Recuperación y verificación de la sesión existente.
- Consulta de los datos del usuario autenticado.

### Administración de usuarios

- Listado de usuarios registrados.
- Visualización de sus roles y estado.
- Activación de usuarios desactivados.
- Desactivación de usuarios activos.

La administración de usuarios está disponible exclusivamente para usuarios con rol `admin`.

### Control de acceso

La aplicación implementa rutas protegidas y restricciones según los roles del usuario autenticado.

- Los usuarios sin sesión son redirigidos al inicio de sesión.
- Los usuarios sin permisos suficientes son redirigidos a una página de acceso no autorizado.
- Las páginas de categorías, productos e ingredientes requieren autenticación.
- La administración de usuarios requiere rol `admin`.
- Las acciones de creación, edición y eliminación de categorías, productos e ingredientes se muestran únicamente a usuarios administradores.

Las restricciones visuales del frontend complementan la autorización implementada en el backend, que es responsable de validar los permisos de cada operación.

## 7. Comunicación con el backend

La aplicación utiliza Axios para comunicarse con la API REST del backend.

Se implementó una instancia centralizada en `src/shared/api/api.ts`, que configura los parámetros comunes para todas las peticiones HTTP.

La URL base configurada es:

`http://localhost:8000/`

### Configuración de Axios

La instancia utiliza:

- `baseURL`: dirección base del backend.
- `withCredentials: true`: permite enviar y recibir cookies en las solicitudes.
- Interceptores de respuestas: centralizan el tratamiento de errores HTTP.

La configuración de los interceptores se encuentra en `src/shared/api/setupInterceptors.ts` y se inicializa al arrancar la aplicación.

### Autenticación mediante cookies

La autenticación utiliza tokens JWT almacenados en una cookie `HttpOnly` denominada `access_token`.

El frontend no accede directamente al contenido del token. El navegador administra la cookie y Axios permite enviarla automáticamente mediante `withCredentials`.

El interceptor de respuestas contempla los siguientes códigos HTTP:

- **401 (Unauthorized):** actualiza el estado de autenticación cuando corresponde, limpiando los datos del usuario almacenados en Zustand. Esto permite que las rutas protegidas gestionen la redirección al inicio de sesión.
- **403 (Forbidden):** informa que el usuario no tiene permisos suficientes mediante una notificación, sin cerrar su sesión.

### Servicios

Las operaciones de comunicación se organizan en servicios independientes dentro de cada funcionalidad:

- `auth.service.ts`: registro, inicio y cierre de sesión, y consulta del usuario autenticado.
- `usuarios.service.ts`: listado, activación y desactivación de usuarios.
- `categoria.service.ts`: operaciones sobre categorías.
- `producto.service.ts`: operaciones sobre productos.
- `ingrediente.service.ts`: operaciones sobre ingredientes.
- `unidad_medida.service.ts`: consulta de unidades de medida.

Esta organización permite separar las peticiones HTTP de la lógica de las páginas y los componentes.

Para permitir la comunicación entre frontend y backend, el servidor FastAPI debe tener configurado CORS para el origen utilizado por Vite:

`http://localhost:5173`

También debe permitir el envío de credenciales.

## 8. Organización y manejo del estado

La aplicación utiliza distintas herramientas para organizar la interfaz, gestionar los datos y controlar el estado.

- **React:** desarrollo de componentes funcionales y composición de interfaces.
- **TypeScript:** tipado de entidades, servicios, propiedades y estados.
- **React Router:** navegación entre páginas y definición de rutas protegidas.
- **TanStack Query:** administración de consultas, mutaciones y caché de datos del servidor.
- **TanStack Form:** gestión de formularios y validaciones.
- **TanStack Table:** construcción de tablas con ordenamiento y paginación.
- **Zustand:** administración del estado global de autenticación, tema visual y notificaciones.
- **Axios:** comunicación centralizada con el backend.
- **Tailwind CSS 4:** implementación de estilos mediante clases de utilidad.

### Hooks personalizados

La aplicación utiliza hooks personalizados para encapsular la lógica de acceso a datos y las operaciones de cada funcionalidad.

Se implementaron:

- `useAuth`: acceso al estado y las acciones de autenticación.
- `useUsuarios`: consultas y operaciones de administración de usuarios.
- `useCategorias`: consultas y mutaciones de categorías.
- `useProductos`: consultas y mutaciones de productos.
- `useUnidadesMedida`: consulta de unidades de medida.
- `useIngredientes`: consultas y mutaciones de ingredientes.

Estos hooks utilizan TanStack Query para administrar las consultas, mutaciones e invalidación de caché, y Zustand para acceder al estado global cuando es necesario.

Además, incorporan notificaciones para informar los resultados exitosos y los errores de las operaciones.

### Estado de autenticación

El estado global de autenticación se administra mediante Zustand en `src/features/auth/store/authStore.ts`.

El store contiene:

- `user`: información del usuario autenticado.
- `checking`: indica si se está verificando la sesión.
- `login`: inicia sesión y obtiene los datos del usuario.
- `logout`: cierra la sesión y limpia el estado local.
- `checkSession`: verifica si existe una sesión válida.
- `setUser`: actualiza el usuario almacenado.

Al iniciar la aplicación se ejecuta `checkSession`, que consulta al backend para recuperar los datos del usuario autenticado mediante la cookie de sesión.

El estado de autenticación no se persiste en el almacenamiento local del navegador. La sesión se verifica nuevamente mediante el backend cada vez que se inicia la aplicación.

### Consultas y mutaciones

TanStack Query permite administrar las operaciones contra el backend mediante consultas (`useQuery`) y mutaciones (`useMutation`).

Después de realizar modificaciones exitosas, se invalidan las consultas correspondientes para actualizar los datos mostrados en pantalla.

Los hooks personalizados encapsulan estas operaciones, evitando repetir la lógica de comunicación y actualización de datos en las páginas.

### Stores globales

Además del estado de autenticación, se implementaron dos stores mediante Zustand:

**themeStore:**

- Administra el tema visual claro y oscuro.
- Permite alternar entre ambos temas.
- Utiliza el middleware `persist` para conservar la preferencia del usuario mediante `theme-storage`.

**notificationStore:**

- Administra el mensaje de las notificaciones.
- Controla su visibilidad.
- Permite mostrar y ocultar notificaciones mediante acciones centralizadas.

### Componentes compartidos

Se implementaron componentes reutilizables para representar distintos estados de la interfaz:

- `LoadingState`: indica que se están cargando datos.
- `ErrorState`: muestra errores durante las consultas.
- `EmptyState`: informa cuando no existen registros disponibles.
- `Toast`: muestra notificaciones globales de éxito y error.

Estos componentes permiten mantener un comportamiento y una presentación coherentes entre las distintas páginas.

### Alias de importación

Se configuró el alias `@/` para simplificar las rutas de importación dentro de `src`.

Su configuración se encuentra tanto en TypeScript como en Vite, permitiendo utilizar rutas más claras y evitando importaciones relativas extensas.

## 9. Compilación

Para verificar la compilación del proyecto, ejecutar:

```bash
pnpm build
```

Este comando ejecuta la verificación de tipos de TypeScript y genera la versión de producción de la aplicación mediante Vite.

Los archivos generados se encuentran en el directorio `dist/`.