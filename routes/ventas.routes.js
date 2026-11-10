import express from "express";
import fs from "fs/promises";
import jwt from "jsonwebtoken";

const router = express.Router();

const archivoVentas = "./data/ventas.json";
const archivoClientes = "./data/clientes.json";
const archivoLibros = "./data/libros.json";

const leerVentas = async () => {
    const data = await fs.readFile(archivoVentas, "utf-8");
    return JSON.parse(data);
};

const guardarVentas = async (ventas) => {
    await fs.writeFile(
        archivoVentas,
        JSON.stringify(ventas, null, 2)
    );
};

const leerClientes = async () => {
    const data = await fs.readFile(archivoClientes, "utf-8");
    return JSON.parse(data);
};

const leerLibros = async () => {
    const data = await fs.readFile(archivoLibros, "utf-8");
    return JSON.parse(data);
};

const guardarLibros = async (libros) => {
    await fs.writeFile(
        archivoLibros,
        JSON.stringify(libros, null, 2)
    );
};

const verificarToken = (req, res, next) => {
    const autorizacion = req.headers.authorization;

    const token = autorizacion?.startsWith("Bearer ")
        ? autorizacion.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({
            mensaje: "Debés iniciar sesión para continuar"
        });
    }

    try {
        req.usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: "Token inválido o vencido"
        });
    }
};

router.use(verificarToken);

router.get("/", async (req, res) => {
    try {
        const ventas = await leerVentas();

        const ventasCliente = ventas.filter(
            venta => venta.id_cliente === req.usuario.id_cliente
        );

        res.json(ventasCliente);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al leer las ventas"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const ventas = await leerVentas();

        const venta = ventas.find(
            item =>
                item.id_venta === id &&
                item.id_cliente === req.usuario.id_cliente
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

router.post("/", async (req, res) => {
    try {
        const idCliente = req.usuario.id_cliente;

        const clientes = await leerClientes();

        const cliente = clientes.find(
            item => item.id_cliente === idCliente
        );

        if (!cliente || !cliente.activo) {
            return res.status(403).json({
                mensaje: "El cliente no existe o está inactivo"
            });
        }

        if (
            !Array.isArray(req.body.libros) ||
            req.body.libros.length === 0
        ) {
            return res.status(400).json({
                mensaje: "La venta debe incluir al menos un libro"
            });
        }

        const ventas = await leerVentas();
        const libros = await leerLibros();

        const librosVenta = [];
        let total = 0;

        for (const item of req.body.libros) {
            if (
                !item ||
                !Number.isInteger(item.id_libro) ||
                !Number.isInteger(item.cantidad) ||
                item.cantidad <= 0
            ) {
                return res.status(400).json({
                    mensaje: "Los datos de los libros no son válidos"
                });
            }

            const libroExistente = librosVenta.find(
                libro => libro.id_libro === item.id_libro
            );

            if (libroExistente) {
                libroExistente.cantidad += item.cantidad;
            } else {
                librosVenta.push({
                    id_libro: item.id_libro,
                    cantidad: item.cantidad
                });
            }
        }

        for (const item of librosVenta) {
            const libro = libros.find(
                libro => libro.id_libro === item.id_libro
            );

            if (!libro) {
                return res.status(400).json({
                    mensaje: "El libro indicado no existe"
                });
            }

            if (libro.stock < item.cantidad) {
                return res.status(400).json({
                    mensaje: "Stock insuficiente para " + libro.titulo
                });
            }

            total += libro.precio * item.cantidad;
        }

        for (const item of librosVenta) {
            const libro = libros.find(
                libro => libro.id_libro === item.id_libro
            );

            libro.stock -= item.cantidad;
            libro.disponible = libro.stock > 0;
        }

        const nuevoId = ventas.length > 0
            ? Math.max(...ventas.map(venta => venta.id_venta)) + 1
            : 1;

        const nuevaVenta = {
            id_venta: nuevoId,
            id_cliente: idCliente,
            fecha: new Date().toISOString(),
            total: total,
            pagada: true,
            libros: librosVenta
        };

        ventas.push(nuevaVenta);

        await guardarVentas(ventas);
        await guardarLibros(libros);

        res.status(201).json(nuevaVenta);
    } catch (error) {
        console.error("Error al registrar la venta:", error);

        res.status(500).json({
            mensaje: "Error al registrar la venta"
        });
    }
});

router.put("/:id", (req, res) => {
    res.status(403).json({
        mensaje: "La modificación de ventas está deshabilitada"
    });
});

router.delete("/:id", (req, res) => {
    res.status(403).json({
        mensaje: "La eliminación de ventas está deshabilitada"
    });
});

export default router;