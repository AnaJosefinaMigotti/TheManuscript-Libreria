const express = require("express");
const router = express.Router();

const { leerJson, guardarJson, siguienteId } = require("../utils/jsonDb");

// Traer todos los clientes
router.get("/", (req, res) => {
  const clientes = leerJson("clientes.json");
  res.json(clientes);
});

// Buscar un cliente por ID
router.get("/:id", (req, res) => {
  const clientes = leerJson("clientes.json");
  const id = Number(req.params.id);

  const cliente = clientes.find(cliente => cliente.id_cliente === id);

  if (!cliente) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado"
    });
  }

  res.json(cliente);
});

// Crear un nuevo cliente
router.post("/", (req, res) => {
  const { nombre, apellido, email, telefono, activo = true } = req.body;

  if (!nombre || !apellido || !email || !telefono) {
    return res.status(400).json({
      mensaje: "Nombre, apellido, email y teléfono son obligatorios"
    });
  }

  const clientes = leerJson("clientes.json");

  const emailExiste = clientes.some(cliente =>
    cliente.email.toLowerCase() === email.toLowerCase()
  );

  if (emailExiste) {
    return res.status(409).json({
      mensaje: "Ya existe un cliente con ese email"
    });
  }

  const nuevoCliente = {
    id_cliente: siguienteId(clientes, "id_cliente"),
    nombre: nombre,
    apellido: apellido,
    email: email,
    telefono: telefono,
    activo: activo
  };

  clientes.push(nuevoCliente);

  guardarJson("clientes.json", clientes);

  res.status(201).json(nuevoCliente);
});

// Modificar un cliente
router.put("/:id", (req, res) => {
  const clientes = leerJson("clientes.json");
  const id = Number(req.params.id);

  const indice = clientes.findIndex(cliente => cliente.id_cliente === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado"
    });
  }

  const { nombre, apellido, email, telefono, activo } = req.body;

  if (email) {
    const emailExiste = clientes.some(cliente =>
      cliente.id_cliente !== id &&
      cliente.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExiste) {
      return res.status(409).json({
        mensaje: "Ya existe otro cliente con ese email"
      });
    }
  }

  if (nombre !== undefined) {
    clientes[indice].nombre = nombre;
  }

  if (apellido !== undefined) {
    clientes[indice].apellido = apellido;
  }

  if (email !== undefined) {
    clientes[indice].email = email;
  }

  if (telefono !== undefined) {
    clientes[indice].telefono = telefono;
  }

  if (activo !== undefined) {
    clientes[indice].activo = activo;
  }

  guardarJson("clientes.json", clientes);

  res.json(clientes[indice]);
});

// Eliminar un cliente
router.delete("/:id", (req, res) => {
  const clientes = leerJson("clientes.json");
  const ventas = leerJson("ventas.json");

  const id = Number(req.params.id);

  const indice = clientes.findIndex(cliente => cliente.id_cliente === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado"
    });
  }

  const tieneVentas = ventas.some(venta => venta.id_cliente === id);

  if (tieneVentas) {
    return res.status(409).json({
      mensaje: "No se puede eliminar el cliente porque tiene ventas asociadas"
    });
  }

  const clienteEliminado = clientes.splice(indice, 1)[0];

  guardarJson("clientes.json", clientes);

  res.json({
    mensaje: "Cliente eliminado correctamente",
    cliente: clienteEliminado
  });
});

module.exports = router;