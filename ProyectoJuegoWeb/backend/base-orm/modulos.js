const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite:" + "./.data/juegos.db");


const usuarios = sequelize.define(
  "usuarios",
  {
    IdUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Clave: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Rol: {
      type: DataTypes.STRING,
      allowNull: false,
    
    }
  },
  {
    timestamps: false,
  }
);

// Definición del modelo de desarrolladores
const desarrolladores = sequelize.define(
  "desarrolladores",
  {   
    IdDesarrollador: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    Pais: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Pais es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Pais debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
    },
    FechaCreacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "La fecha de Creacion es requerida",
        },
        isDate: {
          args: true,
          msg: "Debe ser una fecha válida",
        },
        isAfter: {
          args: "1958-01-01", // Restricción para que la fecha no sea anterior a 1958
          msg: "La fecha de creacion debe ser posterior al 1 de enero de 1958",
        },
        isBefore: {
          args: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0], // Restricción para no aceptar fechas futuras
          msg: "La fecha de creacion no puede ser una fecha futura",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto en false, no eliminado
    }
  },
  {
    timestamps: false,
  }
);

// Definición del modelo de juegos
const juegos = sequelize.define(
  "juegos",
  {
    IdJuego: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 60],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 60 de longitud",
        },
      },
      unique: {
        args: true,
        msg: "este Nombre ya existe en la tabla!",
      },
    },
    FechaLanzamiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "La fecha de lanzamiento es requerida",
        },
        isDate: {
          args: true,
          msg: "Debe ser una fecha válida",
        },
        isAfter: {
          args: "1958-01-01", // Restricción para que la fecha no sea anterior a 1958
          msg: "La fecha de lanzamiento debe ser posterior al 1 de enero de 1958",
        },
        isBefore: {
          args: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0], // Restricción para no aceptar fechas futuras
          msg: "La fecha de lanzamiento no puede ser una fecha futura",
        },
      },
    },
    Precio: {
      type: DataTypes.DECIMAL(10, 2),  // 10 dígitos en total, 2 de ellos después del punto decimal
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "El precio es requerido",
        },
        isDecimal: {
          args: true,
          msg: "Debe ser un número decimal válido",
        },
        min: {
          args: [0],
          msg: "El precio no puede ser negativo",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto en false, no eliminado
    },
    IdDesarrollador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "IdDesarrollador es requerido",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

// Relación entre juegos y desarrolladores
juegos.belongsTo(desarrolladores, {
  foreignKey: 'IdDesarrollador',
  as: 'desarrollador',
});

// Relación entre desarrolladores y juegos
desarrolladores.hasMany(juegos, {
  foreignKey: 'IdDesarrollador',
  as: 'juegos',
});


// Definición del modelo de géneros
const generos = sequelize.define(
  "generos",
  {
    IdGenero: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 60],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 60 de longitud",
        },
      },
      unique: {
        args: true,
        msg: "este Nombre ya existe en la tabla!",
      },
    },
    FechaCreacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "La fecha de Creacion es requerida",
        },
        isDate: {
          args: true,
          msg: "Debe ser una fecha válida",
        },
        isAfter: {
          args: "1958-01-01", // Restricción para que la fecha no sea anterior a 1958
          msg: "La fecha de Creacion debe ser posterior al 1 de enero de 1958",
        },
        isBefore: {
          args: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0], // Restricción para no aceptar fechas futuras
          msg: "La fecha de lanzamiento no puede ser una fecha futura",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto en false, no eliminado
    }
  },
  {
    timestamps: false,
  }
);

// Tabla intermedia para juegos y géneros
const JuegosxGeneros = sequelize.define(
  "JuegosxGeneros",
  {
    IdJuego: {
      type: DataTypes.INTEGER,
      references: {
        model: juegos,
        key: "IdJuego",
      },
    },
    IdGenero: {
      type: DataTypes.INTEGER,
      references: {
        model: generos,
        key: "IdGenero",
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto en false, no eliminado
    }
  },
  {
    timestamps: false,
  }
);

// Relaciones muchos a muchos entre juegos y géneros
juegos.belongsToMany(generos, { 
  through: JuegosxGeneros, 
  foreignKey: 'IdJuego',
});
generos.belongsToMany(juegos, { 
  through: JuegosxGeneros, 
  foreignKey: 'IdGenero',
});

// Definición del modelo de plataformas
const plataformas = sequelize.define(
  "plataformas",
  {
    IdPlataforma: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [5, 30],
          msg: "Nombre debe ser tipo caracteres, entre 5 y 30 de longitud",
        },
      },
      unique: {
        args: true,
        msg: "este Nombre ya existe en la tabla!",
      },
    },
    FechaLanzamiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "La fecha de lanzamiento es requerida",
        },
        isDate: {
          args: true,
          msg: "Debe ser una fecha válida",
        },
        isAfter: {
          args: "1958-01-01", // Restricción para que la fecha no sea anterior a 1958
          msg: "La fecha de lanzamiento debe ser posterior al 1 de enero de 1958",
        },
        isBefore: {
          args: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0], // Restricción para no aceptar fechas futuras
          msg: "La fecha de lanzamiento no puede ser una fecha futura",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto en false, no eliminado
    }
  },
  {
    timestamps: false,
  }
);

// Tabla intermedia para juegos y plataformas
const JuegosxPlataformas = sequelize.define(
  "JuegosxPlataformas",
  {
    IdJuego: {
      type: DataTypes.INTEGER,
      references: {
        model: juegos,
        key: "IdJuego",
      },
    },
    IdPlataforma: {
      type: DataTypes.INTEGER,
      references: {
        model: plataformas,
        key: "IdPlataforma",
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Valor por defecto en false, no eliminado
    }
  },
  {
    timestamps: false,
  }
);

// Relaciones muchos a muchos entre juegos y plataformas
juegos.belongsToMany(plataformas, { 
  through: JuegosxPlataformas, 
  foreignKey: 'IdJuego',
});
plataformas.belongsToMany(juegos, { 
  through: JuegosxPlataformas, 
  foreignKey: 'IdPlataforma',
});

// Sincronización de modelos
(async () => {
  try {
    await sequelize.sync();
    console.log("Modelos sincronizados correctamente.");
  } catch (error) {
    console.error("Error al sincronizar los modelos:", error);
  }
})();

module.exports = {
  sequelize,
  usuarios,
  desarrolladores,
  juegos,
  generos,
  plataformas,
  JuegosxGeneros,
  JuegosxPlataformas,
};
