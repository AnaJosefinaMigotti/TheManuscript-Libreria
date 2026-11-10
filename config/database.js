import { MongoClient } from "mongodb";

const cliente = new MongoClient(process.env.MONGO_URI);

let baseDatos;

export async function conectarMongoDB() {
    await cliente.connect();

    baseDatos = cliente.db(process.env.MONGO_DB);

    await baseDatos.command({ ping: 1 });

    console.log("Conexión a MongoDB establecida correctamente");
}

export function obtenerBaseDatos() {
    if (!baseDatos) {
        throw new Error("MongoDB todavía no está conectado");
    }

    return baseDatos;
}