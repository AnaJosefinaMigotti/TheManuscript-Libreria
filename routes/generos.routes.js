var express = require("express");
var router = express.Router();

var jsonDb = require("../utils/jsonDb");
var leerJson = jsonDb.leerJson;
var guardarJson = jsonDb.guardarJson;
var siguienteId = jsonDb.siguienteId;

// traer todos los géneros
router.get("/", function(req, res) {
  var generos = leerJson("generos.json");
  res.json(generos);
});

// buscar un género por ID
router.get("/:id", function(req, res) {
  var generos = leerJson("generos.json");
  var id = Number(req.params.id);

  var genero = generos.find(function(genero) {
    return genero.id_genero === id;
  });

  if (!genero) {
    return res.status(404).json({
      mensaje: "Género no encontrado"
    });
  }

  res.json(genero);
});

// crear un nuevo género
router.post("/", function(req, res) {
  var nombre = req.body.nombre;
  var activo = req.body.activo;

  if (activo === undefined) {
    activo = true;
  }

  if (!nombre) {
    return res.status(400).json({
      mensaje: "El nombre es obligatorio"
    });
  }

  var generos = leerJson("generos.json");

  var nuevoGenero = {
    id_genero: siguienteId(generos, "id_genero"),
    nombre: nombre,
    activo: activo
  };

  generos.push(nuevoGenero);
  guardarJson("generos.json", generos);

  res.status(201).json(nuevoGenero);
});

// modificar un género
router.put("/:id", function(req, res) {
  var generos = leerJson("generos.json");
  var id = Number(req.params.id);

  var indice = generos.findIndex(function(genero) {
    return genero.id_genero === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Género no encontrado"
    });
  }

  var nombre = req.body.nombre;
  var activo = req.body.activo;

  if (nombre !== undefined) {
    generos[indice].nombre = nombre;
  }

  if (activo !== undefined) {
    generos[indice].activo = activo;
  }

  guardarJson("generos.json", generos);

  res.json(generos[indice]);
});

// eliminar un género
router.delete("/:id", function(req, res) {
  var generos = leerJson("generos.json");
  var libros = leerJson("libros.json");
  var id = Number(req.params.id);

  var indice = generos.findIndex(function(genero) {
    return genero.id_genero === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Género no encontrado"
    });
  }

  var tieneLibros = libros.some(function(libro) {
    return libro.id_genero === id;
  });

  if (tieneLibros) {
    return res.status(409).json({
      mensaje: "No se puede eliminar el género porque tiene libros asociados"
    });
  }

  var generoEliminado = generos.splice(indice, 1)[0];

  guardarJson("generos.json", generos);

  res.json({
    mensaje: "Género eliminado correctamente",
    genero: generoEliminado
  });
});

module.exports = router;