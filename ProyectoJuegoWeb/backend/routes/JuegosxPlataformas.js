const express = require("express");
const router = express.Router();
const db = require("../base-orm/modulos");

// GET: Obtener todos los juegosxplataformas con paginación
router.get("/api/juegosxplataformas", async (req, res, next) => {
  try {
    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;
    const { count, rows } = await db.JuegosxPlataformas.findAndCountAll({
      attributes: ["IdJuego", "IdPlataforma", "Activo"],
      order: [["IdJuego", "ASC"]],
      offset: (Pagina - 1) * TamañoPagina,
      limit: TamañoPagina,
    });

    return res.json({ Items: rows, RegistrosTotal: count });
  } catch (error) {
    next(error);
  }
});

module.exports = router;