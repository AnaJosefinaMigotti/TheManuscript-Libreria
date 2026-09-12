# The Manuscript Librería

**Materia:** Aplicaciones Web II

**Estudiante:** Migotti, Ana Josefina

**N° de Documento:** 43.132.432

## Descripción del proyecto

**The Manuscript Librería** es un proyecto para la gestión de la venta de libros online.

Para esta primera entrega se crearon cuatro archivos JSON relacionados entre sí, que permiten representar clientes, libros, géneros y ventas.

## Archivos JSON

### `clientes.json`

Contiene la información de los clientes registrados en la librería. Cada cliente se identifica mediante `id_cliente` e incluye datos personales y de contacto, además de un campo booleano que indica si se encuentra activo.

### `generos.json`

Contiene los diferentes géneros utilizados para clasificar los libros. Cada género posee un `id_genero`, que permite relacionarlo con los registros almacenados en `libros.json`.

### `libros.json`

Contiene el catálogo de libros de la librería. Cada libro se identifica mediante `id_libro` e incluye información como título, autor, precio, stock y disponibilidad. La relación con su género se establece mediante `id_genero`.

### `ventas.json`

Registra las ventas realizadas en la librería. Cada operación posee un `id_venta` y se relaciona con el cliente que realizó la compra mediante `id_cliente`.

Los libros incluidos en cada venta se almacenan en un array de objetos que contiene el `id_libro` y la cantidad de ejemplares adquiridos. De esta manera, una venta puede incluir uno o varios libros.

## Relación entre los archivos

La estructura general de relaciones es:

**CLIENTES → VENTAS ← LIBROS → GÉNEROS**

* Un cliente puede realizar una o varias ventas.

* Cada venta corresponde a un cliente.

* Una venta puede incluir uno o varios libros.

* Un mismo libro puede formar parte de diferentes ventas.

* Cada libro se encuentra asociado a un género.

## Datos de ejemplo

Los archivos contienen datos de ejemplo para representar distintas situaciones dentro de la librería:

* **5 clientes**

* **10 libros**

* **8 ventas**

* **4 géneros literarios**

Las estructuras utilizan datos de tipo **string, numérico y booleano**, manteniendo la coherencia entre los diferentes archivos mediante sus respectivos identificadores.

---

# Segunda entrega - Servidor Express.js

Para esta segunda entrega se creó un servidor utilizando Express.js y se desarrollaron rutas de enrutamiento para gestionar las solicitudes relacionadas con clientes, libros, géneros y ventas.

Los datos continúan almacenándose en los archivos JSON creados en la primera entrega.

## Ejecución del proyecto

Instalar las dependencias:

```bash
npm install
```

En caso de que PowerShell no permita ejecutar el comando anterior debido a la política de ejecución de scripts, utilizar:

```bash
npm.cmd install
```

Iniciar el servidor:

```bash
node server.js
```

Si el servidor se inicia correctamente, en la terminal aparecerá:

```text
Servidor ejecutándose en http://localhost:3000
```

El servidor debe permanecer ejecutándose mientras se realizan las solicitudes.

---

# Rutas utilizadas

## Solicitudes GET

Las solicitudes GET se utilizan para consultar los datos y pueden probarse directamente desde el navegador.

### Traer todos los registros

#### GET - Traer todos los clientes

```text
http://localhost:3000/clientes
```

#### GET - Traer todos los libros

```text
http://localhost:3000/libros
```

#### GET - Traer todos los géneros

```text
http://localhost:3000/generos
```

#### GET - Traer todas las ventas

```text
http://localhost:3000/ventas
```

### Consultar un registro por ID

#### GET - Consultar un cliente por ID

Ejemplo para consultar el cliente con ID 1:

```text
http://localhost:3000/clientes/1
```

#### GET - Consultar un libro por ID

Ejemplo para consultar el libro con ID 1:

```text
http://localhost:3000/libros/1
```

#### GET - Consultar un género por ID

Ejemplo para consultar el género con ID 1:

```text
http://localhost:3000/generos/1
```

#### GET - Consultar una venta por ID

Ejemplo para consultar la venta con ID 1:

```text
http://localhost:3000/ventas/1
```

---

# Prueba de solicitudes POST, PUT y DELETE

Las solicitudes GET pueden probarse directamente desde el navegador.

Para realizar las solicitudes POST, PUT y DELETE se utiliza Thunder Client, extensión de Visual Studio Code que permite seleccionar el método HTTP, ingresar los datos necesarios y enviar la solicitud al servidor.

El servidor debe ejecutarse primero.

En Thunder Client se debe seleccionar `New Request`, elegir el método correspondiente e ingresar la URL de la solicitud.

Para las solicitudes POST y PUT que requieran el envío de datos, seleccionar:

`Body` → `JSON`

---

# Solicitudes POST

Las solicitudes POST se utilizan para crear nuevos registros.

## POST - Crear un cliente

URL:

```text
http://localhost:3000/clientes
```

En `Body` → `JSON` ingresar:

```json
{
  "nombre": "Ana",
  "apellido": "Pérez",
  "email": "ana.perez@gmail.com",
  "telefono": "3516000000",
  "activo": true
}
```

Si el registro se crea correctamente, el servidor devuelve el nuevo cliente con su ID.

El email ingresado no puede encontrarse registrado previamente para otro cliente.

## POST - Crear un libro

URL:

```text
http://localhost:3000/libros
```

Los datos correspondientes al nuevo libro deben enviarse en formato JSON mediante el `Body` de la solicitud.

## POST - Crear un género

URL:

```text
http://localhost:3000/generos
```

En `Body` → `JSON` ingresar:

```json
{
  "nombre": "Poesía",
  "activo": true
}
```

Si el registro se crea correctamente, el servidor devuelve el nuevo género con su ID.

## POST - Registrar una venta

URL:

```text
http://localhost:3000/ventas
```

Los datos correspondientes a la nueva venta deben enviarse en formato JSON mediante el `Body` de la solicitud.

---

# Solicitudes PUT

Las solicitudes PUT se utilizan para actualizar registros existentes.

## PUT - Modificar un cliente

Ejemplo para modificar el cliente con ID 1:

```text
http://localhost:3000/clientes/1
```

En `Body` → `JSON` ingresar, por ejemplo:

```json
{
  "telefono": "3516111111"
}
```

Solamente se modifican los datos enviados en la solicitud.

Si se modifica el email, se controla que no se encuentre registrado para otro cliente.

## PUT - Modificar un libro

Ejemplo para modificar el libro con ID 1:

```text
http://localhost:3000/libros/1
```

Los datos que se desean modificar deben enviarse mediante `Body` → `JSON`.

## PUT - Modificar un género

Ejemplo para modificar el género con ID 1:

```text
http://localhost:3000/generos/1
```

En `Body` → `JSON` ingresar, por ejemplo:

```json
{
  "nombre": "Novela",
  "activo": true
}
```

## PUT - Modificar una venta

Ejemplo para modificar la venta con ID 1:

```text
http://localhost:3000/ventas/1
```

Los datos que se desean modificar deben enviarse mediante `Body` → `JSON`.

---

# Solicitudes DELETE

Las solicitudes DELETE se utilizan para eliminar registros.

Para realizar estas solicitudes se debe seleccionar el método `DELETE` en Thunder Client, ingresar la URL correspondiente y presionar `Send`.

No es necesario ingresar datos en `Body`.

## DELETE - Eliminar un cliente

Ejemplo:

```text
http://localhost:3000/clientes/6
```

Antes de eliminar el registro se controla si el cliente posee ventas asociadas.

Si existen ventas relacionadas con el cliente, el registro no puede eliminarse, manteniendo de esta manera la integridad de los datos.

## DELETE - Eliminar un libro

Ejemplo:

```text
http://localhost:3000/libros/11
```

## DELETE - Eliminar un género

Ejemplo:

```text
http://localhost:3000/generos/5
```

Antes de eliminar el registro se controla si existen libros asociados al género.

Si existen libros relacionados, el género no puede eliminarse, manteniendo de esta manera la integridad de los datos.

## DELETE - Eliminar una venta

Ejemplo:

```text
http://localhost:3000/ventas/9
```

---

# Validaciones

Para mantener la coherencia y la integridad de los datos se implementaron diferentes controles durante el procesamiento de las solicitudes.

* Se verifica la existencia de los registros antes de realizar determinadas operaciones.

* Se controlan los campos obligatorios al crear nuevos registros.

* No se permite registrar dos clientes con el mismo email.

* No se puede eliminar un cliente que tenga ventas asociadas.

* No se puede eliminar un género que tenga libros asociados.

* Si se intenta consultar, modificar o eliminar un registro inexistente, el servidor informa que el registro no fue encontrado.

* Las relaciones entre clientes, ventas, libros y géneros se mantienen mediante sus respectivos identificadores.

---

# Archivo .gitignore

Se incorporó un archivo `.gitignore` para evitar la incorporación al repositorio de las dependencias instaladas localmente.

```text
# Dependencias de Node.js
node_modules/

# Directorio de dependencias generadas por npm
package-lock.json
```
