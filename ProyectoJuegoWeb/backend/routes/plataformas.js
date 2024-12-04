const express = require("express");
const router = express.Router();
const db = require("../base-orm/modulos");
const { Op, ValidationError } = require("sequelize");
const { authenticateJWT } = require('../seguridad/auth');

// GET: Obtener todas las plataformas con paginación
router.get("/api/plataformas", async (req, res, next) => {
  try {
    const { Nombre } = req.query;
    const whereClause = {};

    if (Nombre) {
      whereClause.Nombre = { [Op.like]: `%${Nombre}%` };  // Búsqueda parcial de nombre
    }

    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;
    const { count, rows } = await db.plataformas.findAndCountAll({
      attributes: ["IdPlataforma", "Nombre", "FechaLanzamiento", "Activo"],
      order: [["Nombre", "ASC"]],
      where: whereClause,
      offset: (Pagina - 1) * TamañoPagina,
      limit: TamañoPagina,
    });

    return res.json({ Items: rows, RegistrosTotal: count });
  } catch (error) {
    next(error);
  }
});

// GET: Obtener una plataforma por ID
router.get("/api/plataformas/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const plataforma = await db.plataformas.findByPk(id, {
      attributes: ["IdPlataforma", "Nombre", "FechaLanzamiento", "Activo"]
    });

    if (plataforma) {
      res.json(plataforma);
    } else {
      res.status(404).json({ error: "Plataforma no encontrada" });
    }
  } catch (error) {
    next(error);
  }
});

// POST: Agregar una nueva plataforma
router.post("/api/plataformas", authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden agregar plataformas." });
  }

  try {
    const nuevaPlataforma = await db.plataformas.create({
      Nombre: req.body.Nombre,
      FechaLanzamiento: req.body.FechaLanzamiento,
      Activo: req.body.Activo !== undefined ? req.body.Activo : true
    });
    res.status(201).json(nuevaPlataforma.dataValues);
  } catch (error) {
    if (error instanceof ValidationError) {
      let messages = '';
      error.errors.forEach((x) => messages += `${x.path}: ${x.message}\n`);
      res.status(400).json({ message: messages });
    } else {
      next(error);
    }
  }
});

// PUT: Actualizar una plataforma existente por ID
router.put("/api/plataformas/:id", authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden actualizar plataformas." });
  }

  try {
    const id = req.params.id;
    const { Nombre, FechaLanzamiento, Activo } = req.body;

    const plataforma = await db.plataformas.findByPk(id);

    if (!plataforma) {
      return res.status(404).json({ error: "Plataforma no encontrada" });
    }

    plataforma.Nombre = Nombre;
    plataforma.FechaLanzamiento = FechaLanzamiento;
    plataforma.Activo = Activo;
    await plataforma.save();

    res.sendStatus(204);
  } catch (error) {
    if (error instanceof ValidationError) {
      let messages = '';
      error.errors.forEach((x) => messages += `${x.path}: ${x.message}\n`);
      res.status(400).json({ message: messages });
    } else {
      next(error);
    }
  }
});

// DELETE: Eliminar una plataforma por ID (baja lógica)
router.delete("/api/plataformas/:id", authenticateJWT, async (req, res) => {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden eliminar plataformas." });
  }

  try {
    const id = req.params.id;

    const plataforma = await db.plataformas.findByPk(id);

    if (!plataforma) {
      return res.status(404).json({ error: "Plataforma no encontrada" });
    }

    plataforma.Activo = false;
    await plataforma.save();

    await db.JuegosxPlataformas.update(
      { Activo: false },
      { where: { IdPlataforma: id } }
    );

    res.json({ mensaje: "Plataforma y relaciones desactivadas (baja lógica)" });
  } catch (error) {
    if (error instanceof ValidationError) {
      const messages = error.errors.map((x) => x.message);
      res.status(400).json(messages);
    } else {
      next(error);
    }
  }
});

module.exports = router;