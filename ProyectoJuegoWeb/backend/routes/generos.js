const express = require("express");
const router = express.Router();
const db = require("../base-orm/modulos");
const { Op, ValidationError } = require("sequelize");
const { authenticateJWT } = require('../seguridad/auth');

// GET: Obtener todos los géneros con paginación
router.get("/api/generos", async (req, res, next) => {
  try {
    const { Nombre } = req.query;
    const whereClause = {};

    if (Nombre) {
      whereClause.Nombre = { [Op.like]: `%${Nombre}%` };  // Búsqueda parcial de nombre
    }

    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;
    const { count, rows } = await db.generos.findAndCountAll({
      attributes: ["IdGenero", "Nombre", "FechaCreacion", "Activo"],
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

// GET: Obtener un género por ID
router.get("/api/generos/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const genero = await db.generos.findByPk(id, {
      attributes: ["IdGenero", "Nombre", "FechaCreacion", "Activo"]
    });

    if (genero) {
      res.json(genero);
    } else {
      res.status(404).json({ error: "Género no encontrado" });
    }
  } catch (error) {
    next(error);
  }
});

// POST: Agregar un nuevo género
router.post("/api/generos", authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden agregar géneros." });
  }

  try {
    const nuevoGenero = await db.generos.create({
      Nombre: req.body.Nombre,
      FechaCreacion: req.body.FechaCreacion,
      Activo: req.body.Activo !== undefined ? req.body.Activo : true
    });
    res.status(201).json(nuevoGenero.dataValues);
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

// PUT: Actualizar un género existente por ID
router.put("/api/generos/:id", authenticateJWT, async (req, res, next) => {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden actualizar géneros." });
  }

  try {
    const id = req.params.id;
    const { Nombre, FechaCreacion, Activo } = req.body;

    const genero = await db.generos.findByPk(id);

    if (!genero) {
      return res.status(404).json({ error: "Género no encontrado" });
    }

    genero.Nombre = Nombre;
    genero.FechaCreacion = FechaCreacion;
    genero.Activo = Activo;
    await genero.save();

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

// DELETE: Eliminar un género por ID (baja lógica)
router.delete("/api/generos/:id", authenticateJWT, async (req, res) => {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden eliminar géneros." });
  }

  try {
    const id = req.params.id;

    const genero = await db.generos.findByPk(id);

    if (!genero) {
      return res.status(404).json({ error: "Género no encontrado" });
    }

    genero.Activo = false;
    await genero.save();

    // Desactivar los juegos relacionados
    const juegosRelacionados = await db.JuegosxGeneros.findAll({ where: { IdGenero: id } });
    const juegosIds = juegosRelacionados.map(jg => jg.IdJuego);

    await db.juegos.update(
      { Activo: false },
      { where: { IdJuego: juegosIds } }
    );

    await db.JuegosxGeneros.update(
      { Activo: false },
      { where: { IdGenero: id } }
    );

    res.json({ mensaje: "Género y juegos relacionados desactivados (baja lógica)" });
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