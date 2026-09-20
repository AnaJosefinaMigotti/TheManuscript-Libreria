import express from "express";
import fs from "fs/promises";

const router = express.Router();
const archivoLibros = "./data/libros.json";
const archivoGeneros = "./data/generos.json";
const archivoVentas = "./data/ventas.json";

// leer libros
const leerLibros = async () => {
  const data = await fs.readFile(archivoLibros, "utf-8");
  return JSON.parse(data);
};

// guardar libros
const guardarLibros = async (libros) => {
  await fs.writeFile(
    archivoLibros,
    JSON.stringify(libros, null, 2)
  );
};

// leer géneros
const leerGeneros = async () => {
  const data = await fs.readFile(archivoGeneros, "utf-8");
  return JSON.parse(data);
};

// leer ventas
const leerVentas = async () => {
  const data = await fs.readFile(archivoVentas, "utf-8");
  return JSON.parse(data);
};

// traer todos los libros
router.get("/", async (req, res) => {
  try {
    const libros = await leerLibros();
    res.json(libros);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al leer los libros"
    });
  }
});

// buscar un libro por ID
router.get("/:id", async (req, res) => {
  try {
    const libros = await leerLibros();
    const id = parseInt(req.params.id);

    const libro = libros.find(
      libro => libro.id_libro === id
    );

    if (!libro) {
      return res.status(404).json({
        mensaje: "Libro no encontrado"
      });
    }

    res.json(libro);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar el libro"
    });
  }
});

// crear un libro
router.post("/", async (req, res) => {
  try {
    const libros = await leerLibros();
    const generos = await leerGeneros();
    const idGenero = parseInt(req.body.id_genero);

    const genero = generos.find(
      genero => genero.id_genero === idGenero
    );

    if (!genero) {
      return res.status(400).json({
        mensaje: "El género indicado no existe"
      });
    }

    const nuevoLibro = {
      id_libro: libros.length > 0
        ? libros.at(-1).id_libro + 1
        : 1,
      titulo: req.body.titulo,
      autor: req.body.autor,
      id_genero: idGenero,
      precio: req.body.precio,
      stock: req.body.stock,
      disponible: req.body.stock > 0
    };

    libros.push(nuevoLibro);
    await guardarLibros(libros);

    res.status(201).json(nuevoLibro);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el libro"
    });
  }
});

// modificar un libro
router.put("/:id", async (req, res) => {
  try {
    const libros = await leerLibros();
    const generos = await leerGeneros();
    const id = parseInt(req.params.id);

    const index = libros.findIndex(
      libro => libro.id_libro === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Libro no encontrado"
      });
    }

    if (req.body.id_genero !== undefined) {
      const idGenero = parseInt(req.body.id_genero);

      const genero = generos.find(
        genero => genero.id_genero === idGenero
      );

      if (!genero) {
        return res.status(400).json({
          mensaje: "El género indicado no existe"
        });
      }

      libros[index].id_genero = idGenero;
    }

    if (req.body.titulo !== undefined) {
      libros[index].titulo = req.body.titulo;
    }

    if (req.body.autor !== undefined) {
      libros[index].autor = req.body.autor;
    }

    if (req.body.precio !== undefined) {
      libros[index].precio = req.body.precio;
    }

    if (req.body.stock !== undefined) {
      libros[index].stock = req.body.stock;
      libros[index].disponible = req.body.stock > 0;
    }

    if (req.body.disponible !== undefined) {
      libros[index].disponible = req.body.disponible;
    }

    await guardarLibros(libros);

    res.json(libros[index]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al modificar el libro"
    });
  }
});

// eliminar un libro
router.delete("/:id", async (req, res) => {
  try {
    const libros = await leerLibros();
    const ventas = await leerVentas();
    const id = parseInt(req.params.id);

    const index = libros.findIndex(
      libro => libro.id_libro === id
    );

    if (index === -1) {
      return res.status(404).json({
        mensaje: "Libro no encontrado"
      });
    }

    const tieneVentas = ventas.find(
      venta => venta.libros.find(
        item => parseInt(item.id_libro) === id
      )
    );

    if (tieneVentas) {
      return res.status(400).json({
        mensaje: "No se puede eliminar el libro porque tiene ventas asociadas"
      });
    }

    const libroEliminado = libros.splice(index, 1);
    await guardarLibros(libros);

    res.json(libroEliminado[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el libro"
    });
  }
});

export default router;
