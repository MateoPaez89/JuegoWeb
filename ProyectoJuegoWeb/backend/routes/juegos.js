const express = require("express");
const router = express.Router();
const db = require("../base-orm/modulos");
const { Op, ValidationError } = require("sequelize");
const { authenticateJWT } = require('../seguridad/auth'); // Asegúrate de que la ruta sea correcta

// Función para verificar si el nombre del juego ya existe
const checkDuplicateName = async (name, idJuego = null) => {
    const whereClause = idJuego ? 
        { Nombre: name, IdJuego: { [Op.ne]: idJuego } } : 
        { Nombre: name };
    return await db.juegos.findOne({ where: whereClause });
};

// Ruta GET para obtener todos los juegos con su desarrollador, géneros y plataformas
router.get("/api/juegos", async function (req, res, next) {
  try {
    const { Nombre, Activo, Pagina } = req.query;
    let whereClause = {};

    if (Nombre) {
      whereClause.Nombre = { [Op.like]: `%${Nombre}%` };  // Búsqueda parcial de nombre
    }

    if (Activo !== undefined && Activo !== null) {
      whereClause.Activo = Activo === 'true';
    }

    const page = parseInt(Pagina) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const { count, rows } = await db.juegos.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.desarrolladores,
          as: 'desarrollador',
          attributes: ['IdDesarrollador', 'Nombre'],
        },
        {
          model: db.generos,
          as: 'generos',
          attributes: ['IdGenero', 'Nombre'],
          through: { attributes: [] }  // Excluir los atributos intermedios
        },
        {
          model: db.plataformas,
          as: 'plataformas',
          attributes: ['IdPlataforma', 'Nombre'],
          through: { attributes: [] }  // Excluir los atributos intermedios
        }
      ],
      distinct: true, // Asegurar que el conteo sea correcto
      offset: offset,
      limit: pageSize,
      order: [['Nombre', 'ASC']]
    });

    // Mapear los juegos con sus géneros y plataformas
    const juegosConDetalles = rows.map(juego => ({
      IdJuego: juego.IdJuego,
      Nombre: juego.Nombre,
      FechaLanzamiento: juego.FechaLanzamiento,
      Precio: juego.Precio,
      Activo: juego.Activo,
      IdDesarrollador: juego.IdDesarrollador,
      Desarrollador: juego.desarrollador ? juego.desarrollador.Nombre : 'No asignado',
      Generos: juego.generos.map(g => g.Nombre),
      Plataformas: juego.plataformas.map(p => p.Nombre)
    }));

    res.json({ Items: juegosConDetalles, RegistrosTotal: count });
  } catch (error) {
    next(error);
  }
});

// Ruta GET para obtener un juego por ID
router.get("/api/juegos/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const juego = await db.juegos.findByPk(id, {
      include: [
        {
          model: db.desarrolladores,
          as: 'desarrollador',
          attributes: ['IdDesarrollador', 'Nombre'],
        },
        {
          model: db.generos,
          as: 'generos',
          attributes: ['IdGenero', 'Nombre'],
          through: { attributes: [] }  // Excluir los atributos intermedios
        },
        {
          model: db.plataformas,
          as: 'plataformas',
          attributes: ['IdPlataforma', 'Nombre'],
          through: { attributes: [] }  // Excluir los atributos intermedios
        }
      ]
    });

    if (!juego) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }

    const juegoConDetalles = {
      IdJuego: juego.IdJuego,
      Nombre: juego.Nombre,
      FechaLanzamiento: juego.FechaLanzamiento,
      Precio: juego.Precio,
      Activo: juego.Activo,
      IdDesarrollador: juego.IdDesarrollador,
      Desarrollador: juego.desarrollador ? juego.desarrollador.Nombre : 'No asignado',
      Generos: juego.generos.map(g => g.Nombre),
      Plataformas: juego.plataformas.map(p => p.Nombre)
    };

    res.json(juegoConDetalles);
  } catch (error) {
    next(error);
  }
});

// Ruta POST para agregar un nuevo juego
router.post("/api/juegos", authenticateJWT, async function (req, res, next) {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden agregar juegos." });
  }

  try {
    const { Nombre, FechaLanzamiento, Precio, Activo, IdDesarrollador, IdGeneros, IdPlataformas } = req.body;

    // Verificar si el nombre del juego ya existe
    const juegoExistente = await checkDuplicateName(Nombre);
    if (juegoExistente) {
      return res.status(400).json({ message: "El nombre del juego ya existe." });
    }

    const nuevoJuego = await db.juegos.create({
      Nombre,
      FechaLanzamiento,
      Precio,
      Activo,
      IdDesarrollador
    });

    // Asociar géneros y plataformas
    await nuevoJuego.setGeneros(IdGeneros);
    await nuevoJuego.setPlataformas(IdPlataformas);

    res.status(201).json(nuevoJuego);
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


// Ruta PUT para actualizar un juego existente por ID
router.put("/api/juegos/:id", authenticateJWT, async function (req, res, next) {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Solo los administradores pueden actualizar juegos." });
  }

  const id = req.params.id;
  const {
    Nombre,
    FechaLanzamiento,
    Precio,
    Activo,
    IdDesarrollador,
    IdGeneros = [],
    IdPlataformas = [],
  } = req.body;

  try {
    // Validar si el juego existe
    const juego = await db.juegos.findByPk(id);
    if (!juego) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }

    // Validar duplicado de nombre
    const juegoExistente = await checkDuplicateName(Nombre, id);
    if (juegoExistente) {
      return res.status(400).json({ message: "El nombre del juego ya existe." });
    }

    // Validar que IdGeneros e IdPlataformas sean arreglos
    if (!Array.isArray(IdGeneros) || !Array.isArray(IdPlataformas)) {
      return res
        .status(400)
        .json({ message: "Los campos IdGeneros e IdPlataformas deben ser arreglos." });
    }

    // Actualizar las propiedades del juego
    juego.Nombre = Nombre;
    juego.FechaLanzamiento = FechaLanzamiento;
    juego.Precio = Precio;
    juego.Activo = Activo;
    juego.IdDesarrollador = IdDesarrollador;
    await juego.save();

    // Asociar géneros y plataformas
    if (IdGeneros.length > 0) {
      await juego.setGeneros(IdGeneros);
    }
    if (IdPlataformas.length > 0) {
      await juego.setPlataformas(IdPlataformas);
    }

    // Actualizar el estado Activo en las tablas relacionadas
    await db.JuegosxGeneros.update({ Activo }, { where: { IdJuego: id } });
    await db.JuegosxPlataformas.update({ Activo }, { where: { IdJuego: id } });

    // Enviar el juego actualizado como respuesta
    res.status(200).json(juego);
  } catch (error) {
    // Manejo de errores
    if (error.name === "SequelizeValidationError" || error.name === "ValidationError") {
      let messages = error.errors.map((x) => `${x.path}: ${x.message}`).join("\n");
      return res.status(400).json({ message: messages });
    }

    // Otros errores se envían al middleware de manejo de errores
    next(error);
  }
});


// Ruta DELETE para eliminar un juego por ID (baja lógica)
router.delete("/api/juegos/:id", authenticateJWT, async function (req, res, next) {
  const { rol } = res.locals.user;

  if (rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Solo los administradores pueden eliminar juegos." });
  }

  try {
    const id = req.params.id;

    const juego = await db.juegos.findByPk(id);

    if (!juego) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }

    juego.Activo = false;
    await juego.save();

    // Desactivar las relaciones en JuegosxGeneros y JuegosxPlataformas
    await db.JuegosxGeneros.update(
      { Activo: false },
      { where: { IdJuego: id } }
    );

    await db.JuegosxPlataformas.update(
      { Activo: false },
      { where: { IdJuego: id } }
    );

    res.json({ mensaje: "Juego desactivado (baja lógica)" });
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