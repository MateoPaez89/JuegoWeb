const express = require("express");
const router = express.Router();
const db = require("../base-orm/modulos");
const { Op, ValidationError } = require("sequelize");
const { authenticateJWT } = require('../seguridad/auth');

// GET: Obtener todos los desarrolladores con paginación
router.get("/api/desarrolladores", async (req, res, next) => {
  try {
    const { Nombre } = req.query;
    const whereClause = {};

    if (Nombre) {
      whereClause.Nombre = { [Op.like]: `%${Nombre}%` };  // Búsqueda parcial de nombre
    }

    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;
    const { count, rows } = await db.desarrolladores.findAndCountAll({
      attributes: ["IdDesarrollador", "Nombre", "Pais", "FechaCreacion", "Activo"],
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

// GET: Obtener un desarrollador por ID
router.get("/api/desarrolladores/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const desarrollador = await db.desarrolladores.findByPk(id, {
      attributes: ["IdDesarrollador", "Nombre", "Pais", "FechaCreacion", "Activo"]
    });

    if (desarrollador) {
      res.json(desarrollador);
    } else {
      res.status(404).json({ error: "Desarrollador no encontrado" });
    }
  } catch (error) {
    next(error);
  }
});

// POST: Agregar un nuevo desarrollador
router.post("/api/desarrolladores", authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden agregar desarrolladores." });
  }

  try {
    const nuevoDesarrollador = await db.desarrolladores.create({
      Nombre: req.body.Nombre,
      Pais: req.body.Pais,
      FechaCreacion: req.body.FechaCreacion,
      Activo: req.body.Activo !== undefined ? req.body.Activo : true
    });
    res.status(201).json(nuevoDesarrollador.dataValues);
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

// PUT: Actualizar un desarrollador existente por ID
router.put("/api/desarrolladores/:id", authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden actualizar desarrolladores." });
  }

  try {
    const id = req.params.id;
    const { Nombre, Pais, FechaCreacion, Activo } = req.body;

    const desarrollador = await db.desarrolladores.findByPk(id);

    if (!desarrollador) {
      return res.status(404).json({ error: "Desarrollador no encontrado" });
    }

    desarrollador.Nombre = Nombre;
    desarrollador.Pais = Pais;
    desarrollador.FechaCreacion = FechaCreacion;
    desarrollador.Activo = Activo;
    await desarrollador.save();

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

// DELETE: Eliminar un desarrollador por ID (baja lógica)
router.delete("/api/desarrolladores/:id", authenticateJWT, async (req, res) => {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden eliminar desarrolladores." });
  }

  try {
    const id = req.params.id;

    const desarrollador = await db.desarrolladores.findByPk(id);

    if (!desarrollador) {
      return res.status(404).json({ error: "Desarrollador no encontrado" });
    }

    desarrollador.Activo = false;
    await desarrollador.save();

    res.json({ mensaje: "Desarrollador desactivado (baja lógica)" });
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