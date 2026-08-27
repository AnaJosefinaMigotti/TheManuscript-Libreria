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
