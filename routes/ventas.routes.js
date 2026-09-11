const express = require("express");
const router = express.Router();

const { leerJson, guardarJson, siguienteId } = require("../utils/jsonDb");

// Traer todas las ventas
router.get("/", (req, res) => {
  const ventas = leerJson("ventas.json");
  res.json(ventas);
});

// Buscar una venta por ID
router.get("/:id", (req, res) => {
  const ventas = leerJson("ventas.json");
  const id = Number(req.params.id);

  const venta = ventas.find(venta => venta.id_venta === id);

  if (!venta) {
    return res.status(404).json({
      mensaje: "Venta no encontrada"
    });
  }

  res.json(venta);
});

// Registrar una nueva venta
router.post("/", (req, res) => {
  const { id_cliente, fecha, pagada = false, libros: detalleLibros } = req.body;

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

  const clientes = leerJson("clientes.json");
  const libros = leerJson("libros.json");
  const ventas = leerJson("ventas.json");

  // Verificar que el cliente exista
  const cliente = clientes.find(
    cliente => cliente.id_cliente === Number(id_cliente)
  );

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

  let total = 0;

  // Verificar libros, cantidades y stock
  for (const item of detalleLibros) {
    const libro = libros.find(
      libro => libro.id_libro === Number(item.id_libro)
    );

    const cantidad = Number(item.cantidad);

    if (!libro) {
      return res.status(400).json({
        mensaje: `El libro con id ${item.id_libro} no existe`
      });
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        mensaje: "La cantidad de cada libro debe ser un entero mayor que cero"
      });
    }

    if (libro.stock < cantidad) {
      return res.status(400).json({
        mensaje: `Stock insuficiente para el libro: ${libro.titulo}`
      });
    }

    total = total + libro.precio * cantidad;
  }

  // Descontar del stock los libros vendidos
  for (const item of detalleLibros) {
    const libro = libros.find(
      libro => libro.id_libro === Number(item.id_libro)
    );

    libro.stock = libro.stock - Number(item.cantidad);
    libro.disponible = libro.stock > 0;
  }

  const nuevaVenta = {
    id_venta: siguienteId(ventas, "id_venta"),
    id_cliente: Number(id_cliente),
    fecha: fecha,
    total: total,
    pagada: pagada,
    libros: []
  };

  // Guardar el detalle de los libros de la venta
  for (const item of detalleLibros) {
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
router.put("/:id", (req, res) => {
  const ventas = leerJson("ventas.json");
  const id = Number(req.params.id);

  const indice = ventas.findIndex(venta => venta.id_venta === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Venta no encontrada"
    });
  }

  const { pagada } = req.body;

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
router.delete("/:id", (req, res) => {
  const ventas = leerJson("ventas.json");
  const libros = leerJson("libros.json");

  const id = Number(req.params.id);

  const indice = ventas.findIndex(venta => venta.id_venta === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Venta no encontrada"
    });
  }

  const ventaEliminada = ventas[indice];

  // Devolver al stock los libros de la venta eliminada
  for (const item of ventaEliminada.libros) {
    const libro = libros.find(
      libro => libro.id_libro === item.id_libro
    );

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