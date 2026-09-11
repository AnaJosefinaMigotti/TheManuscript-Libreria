//lee, guarda y genera los ID de los archivos json

const fs = require("fs");
const path = require("path");

const rutaData = path.join(__dirname, "../data");

function leerJson(nombreArchivo) {
  const rutaArchivo = path.join(rutaData, nombreArchivo);
  const contenido = fs.readFileSync(rutaArchivo, "utf-8");
  return JSON.parse(contenido);
}

function guardarJson(nombreArchivo, datos) {
  const ruta = obtenerRuta(nombreArchivo);
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2), "utf-8");
}

function siguienteId(datos, campoId) {
  if (datos.length === 0) return 1;
  return Math.max(...datos.map(item => item[campoId])) + 1;
}

module.exports = { leerJson, guardarJson, siguienteId };
