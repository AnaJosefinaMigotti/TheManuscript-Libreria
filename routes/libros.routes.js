const express = require("express");
const router = express.Router();

const { leerJson, guardarJson, siguienteId } = require("../utils/jsonDb");

// Traer todos los libros
router.get("/", (req, res) => {
  const libros = leerJson("libros.json");
  res.json(libros);
});

// Buscar un libro por ID
router.get("/:id", (req, res) => {
  const libros = leerJson("libros.json");
  const id = Number(req.params.id);

  const libro = libros.find(libro => libro.id_libro === id);

  if (!libro) {
    return res.status(404).json({
      mensaje: "Libro no encontrado"
    });
  }

  res.json(libro);
});

// Crear un nuevo libro
router.post("/", (req, res) => {
  const { titulo, autor, id_genero, precio, stock } = req.body;

  if (
    !titulo ||
    !autor ||
    id_genero === undefined ||
    precio === undefined ||
    stock === undefined
  ) {
    return res.status(400).json({
      mensaje: "Título, autor, id_genero, precio y stock son obligatorios"
    });
  }

  const generos = leerJson("genero.json");

  const generoExiste = generos.some(
    genero => genero.id_genero === Number(id_genero)
  );

  if (!generoExiste) {
    return res.status(400).json({
      mensaje: "El id_genero indicado no existe"
    });
  }

  if (Number(precio) < 0 || Number(stock) < 0) {
    return res.status(400).json({
      mensaje: "El precio y el stock no pueden ser negativos"
    });
  }

  const libros = leerJson("libros.json");

  const nuevoLibro = {
    id_libro: siguienteId(libros, "id_libro"),
    titulo: titulo,
    autor: autor,
    id_genero: Number(id_genero),
    precio: Number(precio),
    stock: Number(stock),
    disponible: Number(stock) > 0
  };

  libros.push(nuevoLibro);

  guardarJson("libros.json", libros);

  res.status(201).json(nuevoLibro);
});

// Modificar un libro
router.put("/:id", (req, res) => {
  const libros = leerJson("libros.json");
  const generos = leerJson("genero.json");

  const id = Number(req.params.id);

  const indice = libros.findIndex(libro => libro.id_libro === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Libro no encontrado"
    });
  }

  const { titulo, autor, id_genero, precio, stock } = req.body;

  if (id_genero !== undefined) {
    const generoExiste = generos.some(
      genero => genero.id_genero === Number(id_genero)
    );

    if (!generoExiste) {
      return res.status(400).json({
        mensaje: "El id_genero indicado no existe"
      });
    }
  }

  if (precio !== undefined && Number(precio) < 0) {
    return res.status(400).json({
      mensaje: "El precio no puede ser negativo"
    });
  }

  if (stock !== undefined && Number(stock) < 0) {
    return res.status(400).json({
      mensaje: "El stock no puede ser negativo"
    });
  }

  if (titulo !== undefined) {
    libros[indice].titulo = titulo;
  }

  if (autor !== undefined) {
    libros[indice].autor = autor;
  }

  if (id_genero !== undefined) {
    libros[indice].id_genero = Number(id_genero);
  }

  if (precio !== undefined) {
    libros[indice].precio = Number(precio);
  }

  if (stock !== undefined) {
    libros[indice].stock = Number(stock);
    libros[indice].disponible = Number(stock) > 0;
  }

  guardarJson("libros.json", libros);

  res.json(libros[indice]);
});

// Eliminar un libro
router.delete("/:id", (req, res) => {
  const libros = leerJson("libros.json");
  const ventas = leerJson("ventas.json");

  const id = Number(req.params.id);

  const indice = libros.findIndex(libro => libro.id_libro === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Libro no encontrado"
    });
  }

  const apareceEnVentas = ventas.some(venta =>
    venta.libros.some(detalle => detalle.id_libro === id)
  );

  if (apareceEnVentas) {
    return res.status(409).json({
      mensaje: "No se puede eliminar el libro porque aparece en ventas registradas"
    });
  }

  const libroEliminado = libros.splice(indice, 1)[0];

  guardarJson("libros.json", libros);

  res.json({
    mensaje: "Libro eliminado correctamente",
    libro: libroEliminado
  });
});

module.exports = router;