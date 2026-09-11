const express = require("express");
const router = express.Router();

const { leerJson, guardarJson, siguienteId } = require("../utils/jsonDb");

// Traer todos los géneros
router.get("/", (req, res) => {
  const generos = leerJson("genero.json");
  res.json(generos);
});

// Buscar un género por ID
router.get("/:id", (req, res) => {
  const generos = leerJson("genero.json");
  const id = Number(req.params.id);

  const genero = generos.find(genero => genero.id_genero === id);

  if (!genero) {
    return res.status(404).json({
      mensaje: "Género no encontrado"
    });
  }

  res.json(genero);
});

// Crear un nuevo género
router.post("/", (req, res) => {
  const { nombre, activo = true } = req.body;

  if (!nombre) {
    return res.status(400).json({
      mensaje: "El nombre es obligatorio"
    });
  }

  const generos = leerJson("genero.json");

  const nuevoGenero = {
    id_genero: siguienteId(generos, "id_genero"),
    nombre: nombre,
    activo: activo
  };

  generos.push(nuevoGenero);

  guardarJson("genero.json", generos);

  res.status(201).json(nuevoGenero);
});

// Modificar un género
router.put("/:id", (req, res) => {
  const generos = leerJson("genero.json");
  const id = Number(req.params.id);

  const indice = generos.findIndex(genero => genero.id_genero === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Género no encontrado"
    });
  }

  const { nombre, activo } = req.body;

  if (nombre !== undefined) {
    generos[indice].nombre = nombre;
  }

  if (activo !== undefined) {
    generos[indice].activo = activo;
  }

  guardarJson("genero.json", generos);

  res.json(generos[indice]);
});

// Eliminar un género
router.delete("/:id", (req, res) => {
  const generos = leerJson("genero.json");
  const libros = leerJson("libros.json");

  const id = Number(req.params.id);

  const indice = generos.findIndex(genero => genero.id_genero === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Género no encontrado"
    });
  }

  const tieneLibros = libros.some(libro => libro.id_genero === id);

  if (tieneLibros) {
    return res.status(409).json({
      mensaje: "No se puede eliminar el género porque tiene libros asociados"
    });
  }

  const generoEliminado = generos.splice(indice, 1)[0];

  guardarJson("genero.json", generos);

  res.json({
    mensaje: "Género eliminado correctamente",
    genero: generoEliminado
  });
});

module.exports = router;