var express = require("express");
var router = express.Router();

var jsonDb = require("../utils/jsonDb");
var leerJson = jsonDb.leerJson;
var guardarJson = jsonDb.guardarJson;
var siguienteId = jsonDb.siguienteId;

// Traer todos los libros
router.get("/", function(req, res) {
  var libros = leerJson("libros.json");
  res.json(libros);
});

// Buscar un libro por ID
router.get("/:id", function(req, res) {
  var libros = leerJson("libros.json");
  var id = Number(req.params.id);

  var libro = libros.find(function(libro) {
    return libro.id_libro === id;
  });

  if (!libro) {
    return res.status(404).json({
      mensaje: "Libro no encontrado"
    });
  }

  res.json(libro);
});

// Crear un nuevo libro
router.post("/", function(req, res) {
  var titulo = req.body.titulo;
  var autor = req.body.autor;
  var id_genero = req.body.id_genero;
  var precio = req.body.precio;
  var stock = req.body.stock;

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

  var generos = leerJson("generos.json");

  var generoExiste = generos.some(function(genero) {
    return genero.id_genero === Number(id_genero);
  });

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

  var libros = leerJson("libros.json");

  var nuevoLibro = {
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
router.put("/:id", function(req, res) {
  var libros = leerJson("libros.json");
  var generos = leerJson("generos.json");
  var id = Number(req.params.id);

  var indice = libros.findIndex(function(libro) {
    return libro.id_libro === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Libro no encontrado"
    });
  }

  var titulo = req.body.titulo;
  var autor = req.body.autor;
  var id_genero = req.body.id_genero;
  var precio = req.body.precio;
  var stock = req.body.stock;

  if (id_genero !== undefined) {
    var generoExiste = generos.some(function(genero) {
      return genero.id_genero === Number(id_genero);
    });

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
router.delete("/:id", function(req, res) {
  var libros = leerJson("libros.json");
  var ventas = leerJson("ventas.json");
  var id = Number(req.params.id);

  var indice = libros.findIndex(function(libro) {
    return libro.id_libro === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Libro no encontrado"
    });
  }

  var apareceEnVentas = ventas.some(function(venta) {
    return venta.libros.some(function(detalle) {
      return detalle.id_libro === id;
    });
  });

  if (apareceEnVentas) {
    return res.status(409).json({
      mensaje: "No se puede eliminar el libro porque aparece en ventas registradas"
    });
  }

  var libroEliminado = libros.splice(indice, 1)[0];

  guardarJson("libros.json", libros);

  res.json({
    mensaje: "Libro eliminado correctamente",
    libro: libroEliminado
  });
});

module.exports = router;