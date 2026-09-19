var fs = require("fs");
var path = require("path");

function obtenerRuta(nombreArchivo) {
  return path.join(__dirname, "..", "data", nombreArchivo);
}

function leerJson(nombreArchivo) {
  var ruta = obtenerRuta(nombreArchivo);
  var contenido = fs.readFileSync(ruta, "utf-8");
  return JSON.parse(contenido);
}

function guardarJson(nombreArchivo, datos) {
  var ruta = obtenerRuta(nombreArchivo);
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2), "utf-8");
}

function siguienteId(datos, campoId) {
  var mayorId = 0;
  var i;

  for (i = 0; i < datos.length; i++) {
    if (datos[i][campoId] > mayorId) {
      mayorId = datos[i][campoId];
    }
  }

  return mayorId + 1;
}

module.exports = {
  leerJson: leerJson,
  guardarJson: guardarJson,
  siguienteId: siguienteId
};