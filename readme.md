# Actividad Librería

**Materia:** Aplicaciones Web II  
**Estudiante:** Migotti, Ana Josefina  
**N° de Documento:** 43.132.432

Segunda entrega del trabajo práctico de Aplicaciones Web 2.

En esta entrega se agregó Express al proyecto y se crearon las rutas necesarias para trabajar con los datos de clientes, libros, géneros y ventas.

Los datos se encuentran guardados en archivos JSON.

---

## Para ejecutar el proyecto

1. Descargar o clonar el repositorio.

2. Abrir la carpeta del proyecto en Visual Studio Code.

3. Ejecutar:

```bash
npm install
```

Si no funciona y aparece el mensaje:

"No se puede cargar el archivo ...... porque la ejecución de scripts está deshabilitada en este sistema....."

Ejecutar:

```bash
npm.cmd install
```

4. Iniciar el servidor:

```bash
node index.js
```

Si todo funciona correctamente, en la terminal aparecerá:

```text
Servidor corriendo en http://localhost:3000
```

El servidor debe permanecer ejecutándose mientras se realizan las pruebas.

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

## Para probar las solicitudes POST, PUT y DELETE

Las solicitudes GET se pueden probar directamente desde el navegador.

Para probar las solicitudes POST, PUT y DELETE vamos a utilizar Thunder Client, una extensión de Visual Studio Code que permite elegir el tipo de solicitud y enviar datos al servidor.

### Instalar Thunder Client

1. Abrir Visual Studio Code.

2. Seleccionar `Extensiones` en la barra lateral izquierda.

3. En el buscador escribir:

```text
Thunder Client
```

4. Seleccionar Thunder Client y presionar `Install`.

5. Una vez instalado, abrir Thunder Client desde el nuevo ícono que aparece en la barra lateral de Visual Studio Code.

6. Seleccionar `New Request`.

### Realizar una solicitud

1. Verificar que el servidor continúe ejecutándose. En la terminal debe aparecer:

```text
Servidor corriendo en http://localhost:3000
```

Si el servidor no está ejecutándose, abrir la terminal y ejecutar:

```bash
node index.js
```

2. En Thunder Client seleccionar el tipo de solicitud que se quiere realizar: `POST`, `PUT` o `DELETE`.

3. Copiar y pegar la URL correspondiente en el campo de dirección.

4. Para las solicitudes POST y PUT que necesiten enviar datos, seleccionar la pestaña `Body`.

5. Seleccionar el formato `JSON`.

6. Copiar y pegar los datos indicados en los ejemplos.

7. Presionar `Send`.

La respuesta del servidor aparecerá en Thunder Client.

---

## Solicitudes POST

Las solicitudes POST se utilizan para agregar nuevos registros.

### POST - Crear un cliente

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

Presionar `Send`.

Si el registro se creó correctamente, el servidor devolverá el nuevo cliente con su ID.

### POST - Crear un libro

URL:

```text
http://localhost:3000/libros
```

En `Body` → `JSON` ingresar:

```json
{
  "titulo": "Don Quijote de la Mancha",
  "autor": "Miguel de Cervantes",
  "id_genero": 1,
  "precio": 30000,
  "stock": 5
}
```

Presionar `Send`.

Al agregar un libro se controla que el género indicado exista.

### POST - Crear un género

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

Presionar `Send`.

### POST - Registrar una venta

URL:

```text
http://localhost:3000/ventas
```

En `Body` → `JSON` ingresar:

```json
{
  "id_cliente": 2,
  "fecha": "2026-09-07",
  "pagada": true,
  "libros": [
    {
      "id_libro": 2,
      "cantidad": 1
    },
    {
      "id_libro": 5,
      "cantidad": 2
    }
  ]
}
```

Presionar `Send`.

Al registrar una venta se controla que el cliente exista y esté activo, que los libros existan y que tengan stock suficiente.

Cuando la venta se registra, se descuenta del stock la cantidad correspondiente de cada libro.

---

## Solicitudes PUT

Las solicitudes PUT se utilizan para modificar registros existentes.

### PUT - Modificar un cliente

Ejemplo para modificar el cliente con ID 1.

URL:

```text
http://localhost:3000/clientes/1
```

En `Body` → `JSON` ingresar:

```json
{
  "telefono": "3516111111"
}
```

Presionar `Send`.

### PUT - Modificar un libro

Ejemplo para modificar el libro con ID 1.

URL:

```text
http://localhost:3000/libros/1
```

En `Body` → `JSON` ingresar:

```json
{
  "precio": 29000,
  "stock": 10
}
```

Presionar `Send`.

### PUT - Modificar un género

Ejemplo para modificar el género con ID 1.

URL:

```text
http://localhost:3000/generos/1
```

En `Body` → `JSON` ingresar:

```json
{
  "nombre": "Novela",
  "activo": true
}
```

Presionar `Send`.

### PUT - Modificar una venta

Ejemplo para modificar el estado de pago de la venta con ID 1.

URL:

```text
http://localhost:3000/ventas/1
```

En `Body` → `JSON` ingresar:

```json
{
  "pagada": true
}
```

Presionar `Send`.

---

## Solicitudes DELETE

Las solicitudes DELETE se utilizan para eliminar registros.

Para probarlas, seleccionar el método `DELETE` en Thunder Client, copiar la URL correspondiente y presionar `Send`.

No es necesario ingresar datos en `Body`.

### DELETE - Eliminar un cliente

Ejemplo para eliminar el cliente con ID 6:

```text
http://localhost:3000/clientes/6
```

El cliente solamente se puede eliminar si no tiene ventas asociadas.

### DELETE - Eliminar un libro

Ejemplo para eliminar el libro con ID 11:

```text
http://localhost:3000/libros/11
```

El libro solamente se puede eliminar si no aparece relacionado con una venta.

### DELETE - Eliminar un género

Ejemplo para eliminar el género con ID 5:

```text
http://localhost:3000/generos/5
```

El género solamente se puede eliminar si no tiene libros asociados.

### DELETE - Eliminar una venta

Ejemplo para eliminar la venta con ID 9:

```text
http://localhost:3000/ventas/9
```

Al eliminar una venta, las cantidades de los libros incluidos en esa venta se vuelven a sumar al stock.

---

## Validaciones

Para mantener la relación entre los datos se agregaron algunas validaciones:

- No se puede eliminar un cliente si tiene ventas asociadas.
- No se puede eliminar un libro si aparece en una venta.
- No se puede eliminar un género si tiene libros asociados.
- Para registrar una venta, el cliente debe existir y estar activo.
- Los libros incluidos en una venta deben existir y tener stock suficiente.
- Cuando se registra una venta se descuenta el stock correspondiente.
- Si se elimina una venta, las cantidades de los libros vuelven a sumarse al stock.
