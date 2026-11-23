# The Manuscript – Librería

**Materia:** Aplicaciones Web II  
**Estudiante:** Migotti, Ana Josefina  
**N.º de Documento:** 43.132.432

## Descripción del proyecto

The Manuscript es una aplicación web para una librería, desarrollada como trabajo práctico de la materia Aplicaciones Web II.

Permite consultar un catálogo de libros, filtrarlos por género, iniciar sesión y realizar compras.

El proyecto se desarrolló progresivamente, incorporando una interfaz web, un servidor con Node.js y Express, operaciones sobre los datos, autenticación mediante JWT, protección de contraseñas con bcrypt y almacenamiento en MongoDB.

## Tecnologías utilizadas

- HTML, CSS y JavaScript.
- Node.js y Express.
- MongoDB.
- bcryptjs.
- JSON Web Token (JWT).
- Git y GitHub.

## Instalación y ejecución

### Requisitos

- Node.js.
- MongoDB Community Server.
- Navegador web.

### Pasos para ejecutar el proyecto

**1. Descargar el repositorio**

Clonar o descargar el proyecto desde GitHub y abrir la carpeta en Visual Studio Code.

**2. Instalar las dependencias**

Ejecutar en la terminal:

```bash
npm install
```

Si Windows presenta restricciones para ejecutar scripts de PowerShell, utilizar:

```bash
npm.cmd install
```

**3. Configurar las variables de entorno**

El repositorio incluye el archivo `.env.ejemplo`, que contiene las variables necesarias para ejecutar la aplicación.

Crear una copia de ese archivo en la carpeta principal del proyecto y cambiar el nombre de la copia a `.env`.

El contenido debe tener esta estructura:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=themanuscript
JWT_SECRET=REEMPLAZAR_POR_UNA_CLAVE_SECRETA_SEGURA
```

Las variables cumplen las siguientes funciones:

- `MONGO_URI`: dirección de conexión a MongoDB.
- `MONGO_DB`: nombre de la base de datos utilizada.
- `JWT_SECRET`: clave privada para generar y verificar los tokens de autenticación.

**Importante:** reemplazar el valor de `JWT_SECRET` por una clave propia. El archivo `.env` contiene información privada y no debe publicarse en GitHub.

**4. Iniciar MongoDB**

Verificar que el servicio de MongoDB esté en ejecución y que la base de datos `themanuscript` tenga los registros necesarios.

**5. Iniciar el servidor**

Ejecutar:

```bash
node index.js
```

Si la conexión se establece correctamente, la terminal mostrará mensajes de confirmación de conexión a MongoDB y de inicio del servidor.

**6. Abrir la aplicación**

Ingresar desde el navegador a:

http://localhost:3000/views/index.html

**Nota:** la instalación de dependencias no carga automáticamente los datos. Para utilizar el catálogo y probar las compras, la base de datos debe contener los registros de clientes, libros y géneros.

## Credenciales de prueba

Para iniciar sesión y probar las funcionalidades de compra, utilizar el usuario de prueba configurado en la base de datos.

**Correo electrónico:** martin.lopez@gmail.com  
**Contraseña:** Manuscript2026!

Estas credenciales funcionan siempre que el cliente de prueba y su contraseña correspondiente estén cargados en MongoDB.

## Rutas disponibles

### Clientes

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/clientes/login` | Iniciar sesión. |
| GET | `/clientes` | Consultar el cliente autenticado. |
| GET | `/clientes/:id` | Consultar los datos del cliente autenticado por ID. |

### Libros

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/libros` | Consultar todos los libros. |
| GET | `/libros/:id` | Consultar un libro por ID. |

### Géneros

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/generos` | Consultar todos los géneros. |
| GET | `/generos/:id` | Consultar un género por ID. |

### Ventas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/ventas` | Consultar las ventas del cliente autenticado. |
| GET | `/ventas/:id` | Consultar una venta propia por ID. |
| POST | `/ventas` | Registrar una compra. |

Las rutas de clientes y ventas requieren autenticación JWT, excepto `/clientes/login`.

Las operaciones administrativas de creación, modificación y eliminación de clientes, libros y géneros están deshabilitadas en la versión actual. Tampoco se permite modificar ni eliminar ventas.

## Pruebas de las rutas

Las rutas GET públicas pueden consultarse desde el navegador.

Para probar solicitudes POST y rutas protegidas se puede utilizar Thunder Client, una extensión de Visual Studio Code.

Las solicitudes que requieren autenticación deben incluir el encabezado:

```text
Authorization: Bearer TOKEN_DEL_CLIENTE
```

Para obtener el token, primero debe iniciarse sesión mediante la ruta `/clientes/login`.

El token generado tiene una duración de dos horas.

## Base de datos

El proyecto utiliza MongoDB como sistema de almacenamiento y `themanuscript` como nombre de la base de datos.

Las colecciones principales son:

- `clientes`: información de los clientes registrados.
- `libros`: catálogo de libros, precios y stock.
- `generos`: clasificación de los libros.
- `ventas`: compras realizadas.
- `contadores`: generación de identificadores consecutivos para las nuevas ventas.

Los datos se almacenan en MongoDB y son consultados o modificados mediante las rutas del servidor.