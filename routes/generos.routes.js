
import express from "express";
import { obtenerBaseDatos } from "../config/database.js";

const router = express.Router();

const obtenerGeneros = () => {
    return obtenerBaseDatos().collection("generos");
};

const generoPublico = (genero) => {
    const { _id, ...datosGenero } = genero;
    return datosGenero;
};

router.get("/", async (req, res) => {
    try {
        const generos = await obtenerGeneros()
            .find({})
            .sort({ id_genero: 1 })
            .toArray();

        res.json(generos.map(generoPublico));
    } catch (error) {
        console.error("Error al leer los géneros:", error);

        res.status(500).json({
            mensaje: "Error al leer los géneros"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del género no es válido"
            });
        }

        const genero = await obtenerGeneros().findOne({
            id_genero: id
        });

        if (!genero) {
            return res.status(404).json({
                mensaje: "Género no encontrado"
            });
        }

        res.json(generoPublico(genero));
    } catch (error) {
        console.error("Error al buscar el género:", error);

        res.status(500).json({
            mensaje: "Error al buscar el género"
        });
    }
});

router.post("/", (req, res) => {
    res.status(403).json({
        mensaje: "La creación de géneros requiere permisos de administración"
    });
});

router.put("/:id", (req, res) => {
    res.status(403).json({
        mensaje: "La modificación de géneros requiere permisos de administración"
    });
});

router.delete("/:id", (req, res) => {
    res.status(403).json({
        mensaje: "La eliminación de géneros requiere permisos de administración"
    });
});

export default router;
