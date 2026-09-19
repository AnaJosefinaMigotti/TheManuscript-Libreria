var express = require("express");

var clientesRoutes = require("./routes/clientes.routes");
var librosRoutes = require("./routes/libros.routes");
var generosRoutes = require("./routes/generos.routes");
var ventasRoutes = require("./routes/ventas.routes");

var app = express();
var PORT = 3000;

app.use(express.json());

app.get("/", function(req, res) {
  res.json({
    Proyecto: "The Manuscript - Librería",
  });
});

app.use("/clientes", clientesRoutes);
app.use("/libros", librosRoutes);
app.use("/generos", generosRoutes);
app.use("/ventas", ventasRoutes);

app.use(function(req, res) {
  res.status(404).json({
    mensaje: "Ruta no encontrada"
  });
});

app.listen(PORT, function() {
  console.log("Servidor ejecutándose en http://localhost:" + PORT);
});