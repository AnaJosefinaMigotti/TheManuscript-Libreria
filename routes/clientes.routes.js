import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { obtenerBaseDatos } from "../config/database.js";

const router = express.Router();

const obtenerClientes = () => {
    return obtenerBaseDatos().collection("clientes");
};

const clientePublico = (cliente) => {
    const { _id, password_hash, ...datosCliente } = cliente;
    return datosCliente;
};

const verificarToken = (req, res, next) => {
    const encabezado = req.headers.authorization;

    const token = encabezado?.startsWith("Bearer ")
        ? encabezado.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({
            mensaje: "Se requiere iniciar sesión"
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

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                mensaje: "Debe ingresar correo electrónico y contraseña"
            });
        }

        const clientes = obtenerClientes();

        const cliente = await clientes.findOne({
            email: email.trim().toLowerCase()
        });

        if (!cliente || !cliente.activo) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas o cliente inactivo"
            });
        }

        if (typeof cliente.password_hash !== "string") {
            return res.status(401).json({
                mensaje: "El cliente no tiene una contraseña configurada"
            });
        }

        const contraseñaCorrecta = await bcrypt.compare(
            password,
            cliente.password_hash
        );

        if (!contraseñaCorrecta) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas o cliente inactivo"
            });
        }

        const token = jwt.sign(
            { id_cliente: cliente.id_cliente },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            mensaje: "Inicio de sesión correcto",
            cliente: clientePublico(cliente),
            token
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });
    }
});

router.use(verificarToken);

router.get("/", async (req, res) => {
    try {
        const cliente = await obtenerClientes().findOne({
            id_cliente: req.usuario.id_cliente,
            activo: true
        });

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.json(clientePublico(cliente));
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al leer el cliente"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (id !== req.usuario.id_cliente) {
            return res.status(403).json({
                mensaje: "No tiene permiso para consultar este cliente"
            });
        }

        const cliente = await obtenerClientes().findOne({
            id_cliente: id,
            activo: true
        });

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.json(clientePublico(cliente));
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al buscar el cliente"
        });
    }
});

router.post("/", (req, res) => {
    res.status(403).json({
        mensaje: "La creación de clientes está deshabilitada"
    });
});

router.put("/:id", (req, res) => {
    res.status(403).json({
        mensaje: "La modificación de clientes está deshabilitada"
    });
});

router.delete("/:id", (req, res) => {
    res.status(403).json({
        mensaje: "La eliminación de clientes está deshabilitada"
    });
});

export default router;