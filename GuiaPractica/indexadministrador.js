// Importar todas las librerías necesarias.
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const usuarioadministradorRouter = require("../routes/usuarioadministrador"); // Cambiado a usuarioadministrador

// Determinamos el puerto del EndPoint
const PORT = process.env.PORT || 10807;

// Obtenemos la librería controlador del Archivo
const FileSync = require("lowdb/adapters/FileSync");

// Creamos el archivo db.json
const adapter = new FileSync("admin.json");
const db = low(adapter);

// Inicializamos la BD
db.defaults({ usuarioadministrador: [] }).write(); // Cambiado de articulos a usuariosAdministrador

const app = express(); // Creamos el aplicativo 

app.db = db; // Definimos el DB

// Definimos las variables necesarias.
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Mostramos el log de ejecución del servidor
app.listen(PORT, () => console.log(`El servidor está corriendo en el puerto ${PORT}`));

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Librerías APIs - CERTUS",
            version: "1.0.0",
            description: "Demo de Librerías de Ventas API",
        },
        servers: [
            {
                url: "http://localhost:" + PORT
            },
        ],
    },
    apis: ["./routes/*.js"]
};

// Cambiamos el router de artículos a usuarioadministrador
app.use("/usuarioadministrador", usuarioadministradorRouter); // Cambiado de articulos a usuarioadministrador
