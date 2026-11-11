# The Manuscript – Librería

**Materia:** Aplicaciones Web II  
**Estudiante:** Migotti, Ana Josefina  
**N.º de Documento:** 43.132.432

## Descripción del proyecto

The Manuscript es una aplicación web de una librería desarrollada como trabajo práctico de la materia Aplicaciones Web II.

El sistema permite consultar un catálogo de libros, filtrarlos por género, iniciar sesión y realizar compras.

El proyecto se desarrolló progresivamente durante las distintas entregas de la materia, incorporando funcionalidades tanto en el frontend como en el backend.

En la cuarta entrega se implementó la autenticación mediante JWT, el cifrado de contraseñas con bcrypt y la utilización de MongoDB como base de datos NoSQL.

## Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- Node.js
- Express
- MongoDB
- bcryptjs
- JSON Web Token (JWT)

## Instalación y ejecución

### Requisitos

- Node.js
- MongoDB Community Server
- Navegador web

### Pasos para ejecutar el proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Instalar las dependencias:

```bash
npm install
```

Si Windows presenta restricciones para ejecutar scripts de PowerShell, utilizar:

```bash
npm.cmd install
```

4. Verificar que el servicio de MongoDB esté funcionando.
5. Crear un archivo `.env` en la carpeta principal del proyecto:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB=themanuscript
JWT_SECRET=REEMPLAZAR_POR_UNA_CLAVE_SECRETA_SEGURA
```

6. Iniciar el servidor:

```bash
node index.js
```

Si la conexión es correcta, aparecerá:

```text
Conexión a MongoDB establecida correctamente
Servidor corriendo en http://localhost:3000
```

7. Abrir la aplicación:

http://localhost:3000/views/index.html

**Importante:** para utilizar el sistema es necesario que la base de datos `themanuscript` tenga cargados los registros de clientes, libros y géneros. La instalación de dependencias no carga automáticamente estos datos.

## Credenciales de prueba

Para ingresar al sistema y probar las funcionalidades de compra, utilizar:

**Correo electrónico:** martin.lopez@gmail.com  
**Contraseña:** Manuscript2026!

Estas credenciales corresponden a un usuario de prueba.

## Rutas disponibles

### Clientes

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/clientes/login` | Iniciar sesión |
| GET | `/clientes` | Consultar el cliente autenticado |
| GET | `/clientes/:id` | Consultar los datos del cliente autenticado por ID |

### Libros

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/libros` | Consultar todos los libros |
| GET | `/libros/:id` | Consultar un libro por ID |

### Géneros

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/generos` | Consultar todos los géneros |
| GET | `/generos/:id` | Consultar un género por ID |

### Ventas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/ventas` | Consultar las ventas del cliente autenticado |
| GET | `/ventas/:id` | Consultar una venta propia por ID |
| POST | `/ventas` | Registrar una compra |

Las rutas de clientes y ventas requieren autenticación JWT, excepto `/clientes/login`.

Las operaciones de creación, modificación y eliminación de clientes, libros y géneros están deshabilitadas. Tampoco se permite modificar ni eliminar ventas.

## Pruebas de las rutas

Las rutas GET públicas pueden consultarse desde el navegador.

Para probar las solicitudes POST y las rutas protegidas puede utilizarse Thunder Client, una extensión de Visual Studio Code.

Las solicitudes que requieren autenticación deben incluir el encabezado:

```text
Authorization: Bearer TOKEN_DEL_CLIENTE
```

Para obtener el token se debe iniciar sesión mediante `/clientes/login`.

## Base de datos

El proyecto utiliza MongoDB y la base de datos `themanuscript`.

Las colecciones principales son:

- `clientes`
- `libros`
- `generos`
- `ventas`

También se utiliza la colección `contadores` para generar los identificadores de las nuevas ventas.