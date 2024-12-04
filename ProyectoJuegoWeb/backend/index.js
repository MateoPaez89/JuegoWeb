const express = require("express");
const cors = require("cors"); // Importar CORS

// Crear servidor
const app = express();

// Habilitar CORS para todas las solicitudes
app.use(cors({
  origin: ['http://localhost:5173'],  methods: ['GET', 'POST', 'PUT', 'DELETE'],  credentials: true}));

app.use(express.json()); // Para poder leer JSON en el body

// Inicializar base de datos si no existe
require("./base-orm/sqlite-init.js");

// Controlar ruta base
app.get("/", (req, res) => {
  res.send("Control backend!");
});

// Importar y usar rutas
const desarrolladoresRouter = require("./routes/desarrolladores.js");
app.use(desarrolladoresRouter);

const generosRouter = require("./routes/generos.js");
app.use(generosRouter);

const juegosRouter = require("./routes/juegos.js");
app.use(juegosRouter);

const juegosxgenerosRouter = require("./routes/juegosxgeneros.js");
app.use(juegosxgenerosRouter);

const juegosxplataformasRouter = require("./routes/JuegosxPlataformas.js");
app.use(juegosxplataformasRouter);

const plataformasRouter = require("./routes/plataformas.js");
app.use(plataformasRouter);

const seguridadRouter = require("./routes/seguridad.js");
app.use(seguridadRouter);

// Levantar servidor
if (!module.parent) {
  const port = process.env.PORT || 4000;
  app.locals.fechaInicio = new Date();
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}

module.exports = app;