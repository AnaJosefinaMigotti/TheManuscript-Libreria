
import express from "express";
import { loadEnvFile } from "node:process";

loadEnvFile();

const { conectarMongoDB } = await import("./config/database.js");

const { default: clientesRoutes } = await import("./routes/clientes.routes.js");
const { default: librosRoutes } = await import("./routes/libros.routes.js");
const { default: generosRoutes } = await import("./routes/generos.routes.js");
const { default: ventasRoutes } = await import("./routes/ventas.routes.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/clientes", clientesRoutes);
app.use("/libros", librosRoutes);
app.use("/generos", generosRoutes);
app.use("/ventas", ventasRoutes);

app.use((req, res) => {
    res.status(404).json({
        mensaje: "ruta no encontrada"
    });
});

try {
    await conectarMongoDB();

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
}
