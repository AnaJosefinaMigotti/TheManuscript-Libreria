const express = require("express");

const clientesRoutes = require("./routes/clientes.routes");
const librosRoutes = require("./routes/libros.routes");
const generosRoutes = require("./routes/genero.routes");
const ventasRoutes = require("./routes/ventas.routes");

const app = express();
const PORT = 3000;

// permite recibir datos en formato JSON
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    proyecto: "The Manuscript",
    mensaje: "la api ta, funciona"
  });
});

// Rutas de la API
app.use("/clientes", clientesRoutes);
app.use("/libros", librosRoutes);
app.use("/generos", generosRoutes);
app.use("/ventas", ventasRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada"
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
