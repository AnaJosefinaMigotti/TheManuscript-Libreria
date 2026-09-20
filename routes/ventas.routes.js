import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoVentas = "./data/ventas.json";
const archivoClientes = "./data/clientes.json";
const archivoLibros = "./data/libros.json";

// leer ventas
const leerVentas = async () => {
  const data = await fs.readFile(archivoVentas, "utf-8");
  return JSON.parse(data);
};

// guardar ventas
const guardarVentas = async (ventas) => {
  await fs.writeFile(
    archivoVentas,
    JSON.stringify(ventas, null, 2)
  );
};

// leer clientes
const leerClientes = async () => {
  const data = await fs.readFile(archivoClientes, "utf-8");
  return JSON.parse(data);
};

// leer libros
const leerLibros = async () => {
  const data = await fs.readFile(archivoLibros, "utf-8");
  return JSON.parse(data);
};

// gguardar libros
const guardarLibros = async (libros) => {
  await fs.writeFile(
    archivoLibros,
    JSON.stringify(libros, null, 2)
  );
};

// traer todas las ventas
router.get("/", async (req, res) => {
  try {
    const ventas = await leerVentas();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al leer las ventas"
    });
  }
});

// buscar una venta por ID
router.get("/:id", async (req, res) => {
  try {
    const ventas = await leerVentas();
    const id = parseInt(req.params.id);

    const venta = ventas.find(
      venta => venta.id_venta === id
    );

    if (!venta) {
      return res.status(404).json({
        mensaje: "Venta no encontrada"
      });
    }

    res.json(venta);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar la venta"
    });
  }
});

// registrar una nueva venta
router.post("/", async (req, res) => {
  try {
    const ventas = await leerVentas();
    const clientes = await leerClientes();
    const libros = await leerLibros();

    const idCliente = parseInt(req.body.id_cliente);

    const cliente = clientes.find(
      cliente => cliente.id_cliente === idCliente
    );

    if (!cliente) {
      return res.status(400).json({
        mensaje: "El cliente indicado no existe"
      });
    }

    if (!cliente.activo) {
      return res.status(400).json({
        mensaje: "El cliente indicado no está activo"
      });
    }

    if (!req.body.libros || req.body.libros.length === 0) {
      return res.status(400).json({
        mensaje: "La venta debe incluir al menos un libro"
      });
    }

    let total = 0;

    for (let i = 0; i < req.body.libros.length; i++) {
      const item = req.body.libros[i];
      const idLibro = parseInt(item.id_libro);
      const cantidad = parseInt(item.cantidad);

      const libro = libros.find(
        libro => libro.id_libro === idLibro
      );

      if (!libro) {
        return res.status(400).json({
          mensaje: "El libro indicado no existe"
        });
      }

      if (cantidad <= 0) {
        return res.status(400).json({
          mensaje: "La cantidad debe ser mayor que cero"
        });
      }

      if (libro.stock < cantidad) {
        return res.status(400).json({
          mensaje: "Stock insuficiente para " + libro.titulo
        });
      }

      total = total + libro.precio * cantidad;
    }

    for (let i = 0; i < req.body.libros.length; i++) {
      const item = req.body.libros[i];
      const idLibro = parseInt(item.id_libro);
      const cantidad = parseInt(item.cantidad);

      const libro = libros.find(
        libro => libro.id_libro === idLibro
      );

      libro.stock = libro.stock - cantidad;
      libro.disponible = libro.stock > 0;
    }

    const nuevaVenta = {
      id_venta: ventas.length > 0
        ? ventas.at(-1).id_venta + 1
        : 1,
      id_cliente: idCliente,
      fecha: req.body.fecha,
      total: total,
      pagada: req.body.pagada,
      libros: req.body.libros
    };

    ventas.push(nuevaVenta);

    await guardarVentas(ventas);
    await guardarLibros(libros);

    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar la venta"
    });
  }
});

// modificar una venta
router.put("/:id", async (req, res) => {
  try {
    const ventas = await leerVentas();
    const clientes = await leerClientes();
    const id = parseInt(req.params.id);

    const index = ventas.findIndex(
      venta => venta.id_venta === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Venta no encontrada"
      });
    }

    if (req.body.id_cliente !== undefined) {
      const idCliente = parseInt(req.body.id_cliente);

      const cliente = clientes.find(
        cliente => cliente.id_cliente === idCliente
      );

      if (!cliente) {
        return res.status(400).json({
          mensaje: "El cliente indicado no existe"
        });
      }

      if (!cliente.activo) {
        return res.status(400).json({
          mensaje: "El cliente indicado no está activo"
        });
      }

      ventas[index].id_cliente = idCliente;
    }

    if (req.body.fecha !== undefined) {
      ventas[index].fecha = req.body.fecha;
    }

    if (req.body.pagada !== undefined) {
      ventas[index].pagada = req.body.pagada;
    }

    await guardarVentas(ventas);

    res.json(ventas[index]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar la venta"
    });
  }
});

// eliminar una venta
router.delete("/:id", async (req, res) => {
  try {
    const ventas = await leerVentas();
    const libros = await leerLibros();
    const id = parseInt(req.params.id);

    const index = ventas.findIndex(
      venta => venta.id_venta === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Venta no encontrada"
      });
    }

    const venta = ventas[index];

    for (let i = 0; i < venta.libros.length; i++) {
      const item = venta.libros[i];
      const idLibro = parseInt(item.id_libro);
      const cantidad = parseInt(item.cantidad);

      const libro = libros.find(
        libro => libro.id_libro === idLibro
      );

      if (libro) {
        libro.stock = libro.stock + cantidad;
        libro.disponible = libro.stock > 0;
      }
    }

    const ventaEliminada = ventas.splice(index, 1);

    await guardarVentas(ventas);
    await guardarLibros(libros);

    res.json(ventaEliminada[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar la venta"
    });
  }
});

export default router;
