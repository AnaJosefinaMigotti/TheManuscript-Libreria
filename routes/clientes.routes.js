import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoClientes = "./data/clientes.json";
const archivoVentas = "./data/ventas.json";

// leer clientes
const leerClientes = async () => {
  const data = await fs.readFile(archivoClientes, "utf-8");
  return JSON.parse(data);
};

// guardar clientes
const guardarClientes = async (clientes) => {
  await fs.writeFile(
    archivoClientes,
    JSON.stringify(clientes, null, 2)
  );
};

// leer ventas
const leerVentas = async () => {
  const data = await fs.readFile(archivoVentas, "utf-8");
  return JSON.parse(data);
};

// traer todos los clientes
router.get("/", async (req, res) => {
  try {
    const clientes = await leerClientes();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al leer los clientes"
    });
  }
});

// buscar un cliente por ID
router.get("/:id", async (req, res) => {
  try {
    const clientes = await leerClientes();
    const id = parseInt(req.params.id);

    const cliente = clientes.find(
      cliente => cliente.id_cliente === id
    );

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar el cliente"
    });
  }
});

// crear un cliente
router.post("/", async (req, res) => {
  try {
    const clientes = await leerClientes();

    const nuevoCliente = {
      id_cliente: clientes.length > 0
        ? clientes.at(-1).id_cliente + 1
        : 1,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      telefono: req.body.telefono,
      activo: req.body.activo
    };

    clientes.push(nuevoCliente);
    await guardarClientes(clientes);

    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el cliente"
    });
  }
});

// modificar un cliente
router.put("/:id", async (req, res) => {
  try {
    const clientes = await leerClientes();
    const id = parseInt(req.params.id);

    const index = clientes.findIndex(
      cliente => cliente.id_cliente === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    if (req.body.nombre !== undefined) {
      clientes[index].nombre = req.body.nombre;
    }

    if (req.body.apellido !== undefined) {
      clientes[index].apellido = req.body.apellido;
    }

    if (req.body.email !== undefined) {
      clientes[index].email = req.body.email;
    }

    if (req.body.telefono !== undefined) {
      clientes[index].telefono = req.body.telefono;
    }

    if (req.body.activo !== undefined) {
      clientes[index].activo = req.body.activo;
    }

    await guardarClientes(clientes);

    res.json(clientes[index]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar el cliente"
    });
  }
});

// eliminar un cliente
router.delete("/:id", async (req, res) => {
  try {
    const clientes = await leerClientes();
    const ventas = await leerVentas();
    const id = parseInt(req.params.id);

    const index = clientes.findIndex(
      cliente => cliente.id_cliente === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado"
      });
    }

    const tieneVentas = ventas.find(
      venta => venta.id_cliente === id
    );

    if (tieneVentas) {
      return res.status(400).json({
        mensaje: "No se puede eliminar el cliente porque tiene ventas asociadas"
      });
    }

    const clienteEliminado = clientes.splice(index, 1);
    await guardarClientes(clientes);

    res.json(clienteEliminado[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el cliente"
    });
  }
});

export default router;
