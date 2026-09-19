var express = require("express");
var router = express.Router();

var jsonDb = require("../utils/jsonDb");
var leerJson = jsonDb.leerJson;
var guardarJson = jsonDb.guardarJson;
var siguienteId = jsonDb.siguienteId;

// Traer todos los clientes
router.get("/", function(req, res) {
  var clientes = leerJson("clientes.json");
  res.json(clientes);
});

// buscar un cliente por ID
router.get("/:id", function(req, res) {
  var clientes = leerJson("clientes.json");
  var id = Number(req.params.id);

  var cliente = clientes.find(function(cliente) {
    return cliente.id_cliente === id;
  });

  if (!cliente) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado"
    });
  }

  res.json(cliente);
});

// crear un nuevo cliente
router.post("/", function(req, res) {
  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var telefono = req.body.telefono;
  var activo = req.body.activo;

  if (activo === undefined) {
    activo = true;
  }

  if (!nombre || !apellido || !email || !telefono) {
    return res.status(400).json({
      mensaje: "Nombre, apellido, email y teléfono son obligatorios"
    });
  }

  var clientes = leerJson("clientes.json");

  var emailExiste = clientes.some(function(cliente) {
    return cliente.email.toLowerCase() === email.toLowerCase();
  });

  if (emailExiste) {
    return res.status(409).json({
      mensaje: "Ya existe un cliente con ese email"
    });
  }

  var nuevoCliente = {
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
router.put("/:id", function(req, res) {
  var clientes = leerJson("clientes.json");
  var id = Number(req.params.id);

  var indice = clientes.findIndex(function(cliente) {
    return cliente.id_cliente === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado"
    });
  }

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var telefono = req.body.telefono;
  var activo = req.body.activo;

  if (email) {
    var emailExiste = clientes.some(function(cliente) {
      return cliente.id_cliente !== id &&
        cliente.email.toLowerCase() === email.toLowerCase();
    });

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
router.delete("/:id", function(req, res) {
  var clientes = leerJson("clientes.json");
  var ventas = leerJson("ventas.json");
  var id = Number(req.params.id);

  var indice = clientes.findIndex(function(cliente) {
    return cliente.id_cliente === id;
  });

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Cliente no encontrado"
    });
  }

  var tieneVentas = ventas.some(function(venta) {
    return venta.id_cliente === id;
  });

  if (tieneVentas) {
    return res.status(409).json({
      mensaje: "No se puede eliminar el cliente porque tiene ventas asociadas"
    });
  }

  var clienteEliminado = clientes.splice(indice, 1)[0];

  guardarJson("clientes.json", clientes);

  res.json({
    mensaje: "Cliente eliminado correctamente",
    cliente: clienteEliminado
  });
});

module.exports = router;