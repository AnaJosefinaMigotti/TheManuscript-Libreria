
import express from "express";
import { obtenerBaseDatos } from "../config/database.js";

const router = express.Router();

const obtenerLibros = () => {
    return obtenerBaseDatos().collection("libros");
};

const libroPublico = (libro) => {
    const { _id, ...datosLibro } = libro;
    return datosLibro;
};

router.get("/", async (req, res) => {
    try {
        const libros = await obtenerLibros()
            .find({})
            .sort({ id_libro: 1 })
            .toArray();

        res.json(libros.map(libroPublico));
    } catch (error) {
        console.error("Error al leer los libros:", error);

        res.status(500).json({
            mensaje: "Error al leer los libros"
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID del libro no es válido"
            });
        }

        const libro = await obtenerLibros().findOne({
            id_libro: id
        });

        if (!libro) {
            return res.status(404).json({
                mensaje: "Libro no encontrado"
            });
        }

        res.json(libroPublico(libro));
    } catch (error) {
        console.error("Error al buscar el libro:", error);

        res.status(500).json({
            mensaje: "Error al buscar el libro"
        });
    }
});

router.post("/", (req, res) => {
    res.status(403).json({
        mensaje: "La creación de libros requiere permisos de administración"
    });
});

router.put("/:id", (req, res) => {
    res.status(403).json({
        mensaje: "La modificación de libros requiere permisos de administración"
    });
});

router.delete("/:id", (req, res) => {
    res.status(403).json({
        mensaje: "La eliminación de libros requiere permisos de administración"
    });
});

export default router;
