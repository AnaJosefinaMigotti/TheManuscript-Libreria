var express = require("express");
var router = express.Router();

var jsonDb = require("../utils/jsonDb");
var leerJson = jsonDb.leerJson;
var guardarJson = jsonDb.guardarJson;
var siguienteId = jsonDb.siguienteId;

// Traer todas las ventas
router.get("/", function(req, res) {
  var ventas = leerJson("ventas.json");
  res.json(ventas);
});

// Buscar una venta por ID
router.get("/:id", function(req, res) {
  var ventas = leerJson("ventas.json");
  var id = Number(req.params.id);

  var venta = ventas.find(function(venta) {
    return venta.id_venta === id;
  });

  if (!venta) {
    return res.status(404).json({
      mensaje: "Venta no encontrada"
    });
  }

  res.json(venta);
});

// Registrar una nueva venta
router.post("/", function(req, res) {
  var id_cliente = req.body.id_cliente;
  var fecha = req.body.fecha;
  var pagada = req.body.pagada;
  var detalleLibros = req.body.libros;

  if (pagada === undefined) {
    pagada = false;
  }

  if (
    id_cliente === undefined ||
    !fecha ||
    !Array.isArray(detalleLibros) ||
    detalleLibros.length === 0
  ) {
    return res.status(400).json({
      mensaje: "id_cliente, fecha y un array de libros son obligatorios"
    });
  }

  var clientes = leerJson("clientes.json");
  var libros = leerJson("libros.json");
  var ventas = leerJson("ventas.json");

  // Verificar que el cliente exista
  var cliente = clientes.find(function(cliente) {
    return cliente.id_cliente === Number(id_cliente);
  });

  if (!cliente) {
    return res.status(400).json({
      mensaje: "El cliente indicado no existe"
    });
  }

  // Verificar que el cliente esté activo
  if (!cliente.activo) {
    return res.status(400).json({
      mensaje: "El cliente se encuentra inactivo"
    });
  }

  var total = 0;
  var i;
  var item;
  var libro;
  var cantidad;

  // Verificar libros, cantidades y stock
  for (i = 0; i < detalleLibros.length; i++) {
    item = detalleLibros[i];

    libro = libros.find(function(libro) {
      return libro.id_libro === Number(item.id_libro);
    });

    cantidad = Number(item.cantidad);

    if (!libro) {
      return res.status(400).json({
        mensaje: "El libro con id " + item.id_libro + " no existe"
      });
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        mensaje: "La cantidad de cada libro debe ser un entero mayor que cero"
      });
    }

    if (libro.stock < cantidad) {
      return res.status(400).json({
        mensaje: "Stock insuficiente para el libro: " + libro.titulo
      });
    }

    total = total + libro.precio * cantidad;
  }

  // Descontar del stock los libros vendidos
  for (i = 0; i < detalleLibros.length; i++) {
    item = detalleLibros[i];

    libro = libros.find(function(libro) {
      return libro.id_libro === Number(item.id_libro);
    });

    libro.stock = libro.stock - Number(item.cantidad);
    libro.disponible = libro.stock > 0;
  }

  var nuevaVenta = {
    id_venta: siguienteId(ventas, "id_venta"),
    id_cliente: Number(id_cliente),
    fecha: fecha,
    total: total,
    pagada: pagada,
    libros: []
  };

  // Guardar el detalle de los libros de la venta
  for (i = 0; i < detalleLibros.length; i++) {
    item = detalleLibros[i];

    nuevaVenta.libros.push({
      id_libro: Number(item.id_libro),
      cantidad: Number(item.cantidad)
    });
  }

  ventas.push(nuevaVenta);

  guardarJson("ventas.json", ventas);
  guardarJson("libros.json", libros);

  res.status(201).json(nuevaVenta);
});

// Modificar el estado de pago de una venta
router.put("/:id", function(req, res) {
  var ventas = leerJson("ventas.json");
  var id = Number(req.params.id);

  var indice = ventas.findIndex(function(venta) {
    return venta.id_venta === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Venta no encontrada"
    });
  }

  var pagada = req.body.pagada;

  if (pagada === undefined) {
    return res.status(400).json({
      mensaje: "Para esta actualización debe indicar el campo pagada"
    });
  }

  ventas[indice].pagada = pagada;

  guardarJson("ventas.json", ventas);

  res.json(ventas[indice]);
});

// Eliminar una venta
router.delete("/:id", function(req, res) {
  var ventas = leerJson("ventas.json");
  var libros = leerJson("libros.json");
  var id = Number(req.params.id);

  var indice = ventas.findIndex(function(venta) {
    return venta.id_venta === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Venta no encontrada"
    });
  }

  var ventaEliminada = ventas[indice];
  var i;
  var item;
  var libro;

  // Devolver al stock los libros de la venta eliminada
  for (i = 0; i < ventaEliminada.libros.length; i++) {
    item = ventaEliminada.libros[i];

    libro = libros.find(function(libro) {
      return libro.id_libro === item.id_libro;
    });

    if (libro) {
      libro.stock = libro.stock + item.cantidad;
      libro.disponible = libro.stock > 0;
    }
  }

  ventas.splice(indice, 1);

  guardarJson("ventas.json", ventas);
  guardarJson("libros.json", libros);

  res.json({
    mensaje: "Venta eliminada y stock restituido correctamente",
    venta: ventaEliminada
  });
});

module.exports = router;