
import express from "express";
import jwt from "jsonwebtoken";
import { obtenerBaseDatos } from "../config/database.js";

const router = express.Router();

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

const ventaPublica = (venta) => {
    const { _id, ...datosVenta } = venta;
    return datosVenta;
};

router.use(verificarToken);

router.get("/", async (req, res) => {
    try {
        const ventas = await obtenerBaseDatos()
            .collection("ventas")
            .find({ id_cliente: req.usuario.id_cliente })
            .sort({ id_venta: 1 })
            .toArray();

        res.json(ventas.map(ventaPublica));
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al leer las ventas"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID de la venta no es válido"
            });
        }

        const venta = await obtenerBaseDatos()
            .collection("ventas")
            .findOne({
                id_venta: id,
                id_cliente: req.usuario.id_cliente
            });

        if (!venta) {
            return res.status(404).json({
                mensaje: "Venta no encontrada"
            });
        }

        res.json(ventaPublica(venta));
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al buscar la venta"
        });
    }
});

router.post("/", async (req, res) => {
    const baseDatos = obtenerBaseDatos();
    const clientes = baseDatos.collection("clientes");
    const libros = baseDatos.collection("libros");
    const ventas = baseDatos.collection("ventas");
    const contadores = baseDatos.collection("contadores");

    const reservados = [];
    let ventaRegistrada = false;

    try {
        const idCliente = req.usuario.id_cliente;

        const cliente = await clientes.findOne({
            id_cliente: idCliente,
            activo: true
        });

        if (!cliente) {
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

        const cantidades = new Map();

        for (const item of req.body.libros) {
            if (
                !item ||
                !Number.isInteger(item.id_libro) ||
                item.id_libro <= 0 ||
                !Number.isSafeInteger(item.cantidad) ||
                item.cantidad <= 0
            ) {
                return res.status(400).json({
                    mensaje: "Los datos de los libros no son válidos"
                });
            }

            const cantidad = (
                cantidades.get(item.id_libro) || 0
            ) + item.cantidad;

            if (!Number.isSafeInteger(cantidad)) {
                return res.status(400).json({
                    mensaje: "La cantidad solicitada no es válida"
                });
            }

            cantidades.set(item.id_libro, cantidad);
        }

        const librosVenta = [];
        let total = 0;

        for (const [id_libro, cantidad] of cantidades) {
            const libro = await libros.findOne({ id_libro });

            if (!libro) {
                return res.status(400).json({
                    mensaje: "El libro indicado no existe"
                });
            }

            if (
                !Number.isFinite(libro.precio) ||
                libro.precio < 0
            ) {
                return res.status(500).json({
                    mensaje: "El precio del libro no es válido"
                });
            }

            if (
                !libro.disponible ||
                libro.stock < cantidad
            ) {
                return res.status(400).json({
                    mensaje: "Stock insuficiente para " + libro.titulo
                });
            }

            librosVenta.push({
                id_libro,
                cantidad
            });

            total += libro.precio * cantidad;
        }

        for (const item of librosVenta) {
            const resultado = await libros.updateOne(
                {
                    id_libro: item.id_libro,
                    disponible: true,
                    stock: { $gte: item.cantidad }
                },
                {
                    $inc: {
                        stock: -item.cantidad
                    }
                }
            );

            if (resultado.modifiedCount !== 1) {
                throw new Error(
                    "STOCK_INSUFICIENTE"
                );
            }

            reservados.push(item);
        }

        for (const item of reservados) {
            await libros.updateOne(
                {
                    id_libro: item.id_libro,
                    stock: 0
                },
                {
                    $set: {
                        disponible: false
                    }
                }
            );
        }

        const ultimoId = await ventas
            .find({})
            .sort({ id_venta: -1 })
            .limit(1)
            .next();

        const idInicial = ultimoId?.id_venta || 0;

        await contadores.updateOne(
            { _id: "ventas" },
            {
                $max: {
                    secuencia: idInicial
                }
            },
            { upsert: true }
        );

        const contador = await contadores.findOneAndUpdate(
            { _id: "ventas" },
            { $inc: { secuencia: 1 } },
            { returnDocument: "after" }
        );

        const nuevaVenta = {
            id_venta: contador.secuencia,
            id_cliente: idCliente,
            fecha: new Date().toISOString(),
            total,
            pagada: true,
            libros: librosVenta
        };

        await ventas.insertOne(nuevaVenta);
        ventaRegistrada = true;

        res.status(201).json(ventaPublica(nuevaVenta));
    } catch (error) {
        console.error("Error al registrar la venta:", error);

        if (!ventaRegistrada && reservados.length > 0) {
            for (const item of reservados) {
                try {
                    await libros.updateOne(
                        { id_libro: item.id_libro },
                        {
                            $inc: {
                                stock: item.cantidad
                            },
                            $set: {
                                disponible: true
                            }
                        }
                    );
                } catch (errorReversion) {
                    console.error(
                        "Error al restaurar stock:",
                        errorReversion
                    );
                }
            }
        }

        if (error.message === "STOCK_INSUFICIENTE") {
            return res.status(409).json({
                mensaje: "Stock insuficiente. Actualizá el catálogo."
            });
        }

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