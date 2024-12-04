const express = require("express");
const auth = require("../seguridad/auth");
const router = express.Router();

router.post("/login", auth.login);

router.post("/api/juegos", auth.authenticateJWT, async (req, res) => {
  const { Nombre, IdDesarrollador, IdGenero, IdPlataforma, FechaLanzamiento, Activo } = req.body;

  try {
    if (!Nombre || !IdDesarrollador || !IdGenero || !IdPlataforma || !FechaLanzamiento) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const nuevoJuego = await juegos.create({
      Nombre,
      IdDesarrollador,
      IdGenero,
      IdPlataforma,
      FechaLanzamiento,
      Activo: Activo !== undefined ? Activo : true
    });

    res.status(201).json(nuevoJuego);
  } catch (error) {
    console.error("Error al agregar el juego:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;