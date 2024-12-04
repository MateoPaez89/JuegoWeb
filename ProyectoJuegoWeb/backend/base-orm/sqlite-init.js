// acceder a la base usando aa-sqlite
const db = require("aa-sqlite");
const bcrypt = require("bcrypt");

async function CrearBaseSiNoExiste() {
  // abrir base, si no existe el archivo/base lo crea
  await db.open("./.data/juegos.db");
  //await db.open(process.env.base);

  let existe = false;
  let res = null;

  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'desarrolladores'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      "CREATE table desarrolladores( IdDesarrollador INTEGER PRIMARY KEY AUTOINCREMENT, Nombre text NOT NULL UNIQUE, Pais TEXT NOT NULL, FechaCreacion DATE, Activo BOOL DEFAULT TRUE);"
    );
    console.log("tabla desarrolladores creada!");
      await db.run(
      `insert into desarrolladores values	
        (1, 'Nintendo', 'Japón', '1889-09-23', true),
        (2, 'Rockstar Games', 'Estados Unidos', '1998-12-01', true),
        (3, 'CD Projekt', 'Polonia', '1994-05-01', true),
        (4, 'FromSoftware', 'Japón', '1986-11-01', true),
        (5, 'Bungie', 'Estados Unidos', '1991-05-01', true),
        (6, 'Blizzard Entertainment', 'Estados Unidos', '1991-02-08', true),
        (7, 'Valve Corporation', 'Estados Unidos', '1996-08-24', true),
        (8, 'Epic Games', 'Estados Unidos', '1991-06-15', true),
        (9, 'Ubisoft', 'Francia', '1986-03-28', true),
        (10, 'Insomniac Games', 'Estados Unidos', '1994-02-28', true),
        (11, 'Electronic Arts', 'Estados Unidos', '1982-05-28', true),
        (12, 'Riot Games', 'Estados Unidos', '2006-09-06', true),
        (13, 'Bethesda Game Studios', 'Estados Unidos', '1985-06-28', true),
        (14, 'Square Enix', 'Japón', '1986-09-22', true),
        (15, 'Naughty Dog', 'Estados Unidos', '1984-10-25', true),
        (16, 'Kojima Productions', 'Japón', '2005-12-16', true),
        (17, 'PlatinumGames', 'Japón', '2006-04-01', true),
        (18, 'Respawn Entertainment', 'Estados Unidos', '2010-04-01', true),
        (19, 'Sucker Punch Productions', 'Estados Unidos', '1997-01-01', true),
        (20, 'Hello Games', 'Reino Unido', '2012-08-01', true),
        (21, 'Remedy Entertainment', 'Finlandia', '1995-06-01', true);`
    );

  }

  existe = false
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'usuarios'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      "CREATE table usuarios( IdUsuario INTEGER PRIMARY KEY AUTOINCREMENT, Usuario text NOT NULL UNIQUE, Clave text NOT NULL, Rol text NOT NULL);"
    );
    console.log("tabla usuarios creada!");

    try {
      const plainPasswordAdmin = "123";
      const plainPasswordDev = "123";
  
      // Hashear contraseñas y verificar
      const hashedPasswordAdmin = await bcrypt.hash(plainPasswordAdmin, 10);
      const hashedPasswordDev = await bcrypt.hash(plainPasswordDev, 10);
  
      console.log("Hashed Password Admin:", hashedPasswordAdmin);
      console.log("Hashed Password Dev:", hashedPasswordDev);
  
      // Validación explícita
      if (!hashedPasswordAdmin || !hashedPasswordDev) {
        throw new Error("Las contraseñas no se han hasheado correctamente.");
      }
  
      // Imprimir valores antes de la inserción
      console.log(`Insertando usuario 'admin': admin, ${hashedPasswordAdmin}, admin`);
      console.log(`Insertando usuario 'Epic Games': Epic Games, ${hashedPasswordDev}, desarrollador`);
  
      // Insertar usuarios
      await db.run(
        `INSERT INTO usuarios (Usuario, Clave, Rol) VALUES ('admin', '${hashedPasswordAdmin}', 'admin');`
      );
      await db.run(
        `INSERT INTO usuarios (Usuario, Clave, Rol) VALUES ('Epic Games', '${hashedPasswordDev}', 'desarrollador');`
      );
  
      console.log("Usuarios insertados correctamente!");
    } catch (error) {
      console.error("Error al hashear las contraseñas o insertar usuarios:", error);
    }
  }
  

  existe = false;
  sql =
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'juegos'";
  res = await db.get(sql, []);
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      `CREATE table juegos( 
              IdJuego INTEGER PRIMARY KEY AUTOINCREMENT
            , Nombre text NOT NULL UNIQUE
            , FechaLanzamiento date
            , Precio FLOAT
            , Activo BOOL DEFAULT TRUE
            , IdDesarrollador integer
            ,FOREIGN KEY (IdDesarrollador) REFERENCES desarrolladores(IdDesarrollador) 
            );`
    );
    console.log("tabla juegos creada!");

    await db.run(
      `INSERT INTO juegos (IdJuego, Nombre, FechaLanzamiento, Precio, Activo, IdDesarrollador) VALUES
        (1, "Super Mario Bros.", "1985-09-13", 50.00, TRUE, 1),
        (2, "The Legend of Zelda", "1986-02-21", 70.00, TRUE, 1),
        (3, "Grand Theft Auto V", "2013-09-17", 150.00, TRUE, 2),
        (4, "Red Dead Redemption 2", "2018-10-26", 100.00, TRUE, 2),
        (5, "The Witcher 3: Wild Hunt", "2015-05-19", 120.00, TRUE, 3),
        (6, "Dark Souls", "2011-09-22", 80.00, TRUE, 4),
        (7, "Halo: Combat Evolved", "2001-11-15", 60.00, TRUE, 5),
        (8, "Destiny", "2014-09-09", 90.00, TRUE, 5),
        (9, "World of Warcraft", "2004-11-23", 40.00, TRUE, 6),
        (10, "Overwatch", "2016-05-24", 60.00, TRUE, 6),
        (11, "Half-Life 2", "2004-11-16", 50.00, TRUE, 7),
        (12, "Portal 2", "2011-04-18", 60.00, TRUE, 7),
        (13, "Fortnite", "2017-07-25", 0.00, TRUE, 8),  -- Free to play
        (14, "Gears of War", "2006-11-12", 70.00, TRUE, 8),
        (15, "Assassin's Creed IV: Black Flag", "2013-10-29", 90.00, TRUE, 9),
        (16, "Far Cry 5", "2018-03-27", 120.00, TRUE, 9),
        (17, "Spider-Man", "2018-09-07", 100.00, TRUE, 10),
        (18, "Watch Dogs", "2014-05-27", 80.00, TRUE, 10),
        (19, "Call of Duty: Modern Warfare", "2019-10-25", 60.00, TRUE, 11),
        (20, "The Last of Us", "2013-06-14", 80.00, TRUE, 12),
        (21, "Bloodborne", "2015-03-24", 100.00, TRUE, 4),
        (22, "Final Fantasy VII", "1997-01-31", 50.00, TRUE, 13),
        (23, "Kingdom Hearts", "2002-03-28", 60.00, TRUE, 13),
        (24, "The Elder Scrolls V: Skyrim", "2011-11-11", 70.00, TRUE, 14),
        (25, "Resident Evil 2", "2019-01-25", 100.00, TRUE, 15),
        (26, "Monster Hunter: World", "2018-01-26", 90.00, TRUE, 16),
        (27, "Hollow Knight", "2017-02-24", 20.00, TRUE, 17),
        (28, "Celeste", "2018-01-25", 20.00, TRUE, 18),
        (29, "Stardew Valley", "2016-02-26", 30.00, TRUE, 19),
        (30, "No Man's Sky", "2016-08-09", 60.00, TRUE, 20),
        (31, "Dying Light", "2015-01-27", 50.00, TRUE, 21);
      `
    );    
  }


  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'generos'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      "CREATE table generos( IdGenero INTEGER PRIMARY KEY AUTOINCREMENT, Nombre text NOT NULL UNIQUE, FechaCreacion DATE DEFAULT CURRENT_DATE, Activo BOOL DEFAULT TRUE);"
    );
    console.log("tabla generos creada!");
    await db.run(
      `INSERT INTO generos (IdGenero, Nombre, Activo) VALUES
        (1, 'Shooter', TRUE), 
        (2, 'Survival Horror', TRUE), 
        (3, 'Plataformas', TRUE), 
        (4, 'Simulación', TRUE), 
        (5, 'Deportes', TRUE),
        (6, 'Estrategia', TRUE),
        (7, 'MOBA', TRUE),
        (8, 'Battle Royale', TRUE),
        (9, 'Sandbox', TRUE),
        (10, 'Aventura gráfica', TRUE),
        (11, 'Puzzle', TRUE),
        (12, 'Carreras', TRUE),
        (13, 'Terror', TRUE),
        (14, 'Metroidvania', TRUE),
        (15, 'Lucha', TRUE),
        (16, 'Roguelike', TRUE),
        (17, 'RTS', TRUE),
        (18, 'MMORPG', TRUE);`
    );    
  }

  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'plataformas'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      "CREATE table plataformas( IdPlataforma INTEGER PRIMARY KEY AUTOINCREMENT, Nombre text NOT NULL UNIQUE, FechaLanzamiento DATE, Activo BOOL DEFAULT TRUE);"
    );
    console.log("tabla plataformas creada!");
    await db.run(
      `INSERT INTO plataformas (IdPlataforma, Nombre, FechaLanzamiento, Activo) VALUES
        (1, 'Xbox Series X', '2020-11-10', TRUE), 
        (2, 'PlayStation 4', '2013-11-15', TRUE), 
        (3, 'Xbox One', '2013-11-22', TRUE), 
        (4, 'Nintendo Switch', '2017-03-03', TRUE), 
        (5, 'Stadia', '2019-11-19', TRUE),
        (6, 'PC', '1981-08-12', TRUE),
        (7, 'Steam', '2003-09-12', TRUE),
        (8, 'iOS', '2007-07-29', TRUE),
        (9, 'Android', '2008-09-23', TRUE),
        (10, 'Nintendo 3DS', '2011-02-26', TRUE),
        (11, 'Wii U', '2012-11-18', TRUE),
        (12, 'PlayStation 3', '2006-11-11', TRUE),
        (13, 'PlayStation 2', '2000-03-04', TRUE),
        (14, 'Xbox 360', '2005-11-22', TRUE),
        (15, 'Oculus Rift', '2016-03-28', TRUE),
        (16, 'HTC Vive', '2016-04-05', TRUE),
        (17, 'Nintendo DS', '2004-11-21', TRUE),
        (18, 'PS Vita', '2011-12-17', TRUE);
      `
    );
    
    
  }

  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'JuegosxGeneros'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      "CREATE table JuegosxGeneros(  IdJuego INTEGER, IdGenero INTEGER, Activo BOOL DEFAULT TRUE, PRIMARY KEY (IdJuego, IdGenero),FOREIGN KEY (IdJuego) REFERENCES Juegos(IdJuego), FOREIGN KEY (IdGenero) REFERENCES Generos(IdGenero));"
    );
    console.log("tabla JuegosxGeneros creada!");
    await db.run(
      `
      INSERT INTO JuegosxGeneros (IdJuego, IdGenero, Activo) VALUES
        (1, 3, TRUE),   -- Super Mario Bros. -> Plataformas
        (2, 10, TRUE),  -- The Legend of Zelda -> Aventura gráfica
        (3, 9, TRUE),   -- Grand Theft Auto V -> Sandbox
        (3, 8, TRUE),   -- Grand Theft Auto V -> Battle Royale
        (4, 9, TRUE),   -- Red Dead Redemption 2 -> Sandbox
        (5, 16, TRUE),  -- The Witcher 3 -> Roguelike
        (5, 10, TRUE),  -- The Witcher 3 -> Aventura gráfica
        (6, 14, TRUE),  -- Dark Souls -> Metroidvania
        (6, 13, TRUE),  -- Dark Souls -> Terror
        (7, 1, TRUE),   -- Halo: Combat Evolved -> Shooter
        (8, 1, TRUE),   -- Destiny -> Shooter
        (8, 18, TRUE),  -- Destiny -> MMORPG
        (9, 18, TRUE),  -- World of Warcraft -> MMORPG
        (10, 1, TRUE),  -- Overwatch -> Shooter
        (10, 18, TRUE), -- Overwatch -> MMORPG
        (11, 9, TRUE),  -- Half-Life 2 -> Sandbox
        (12, 11, TRUE), -- Portal 2 -> Puzzle
        (13, 8, TRUE),  -- Fortnite -> Battle Royale
        (13, 9, TRUE),  -- Fortnite -> Sandbox
        (14, 1, TRUE),  -- Gears of War -> Shooter
        (15, 9, TRUE),  -- Assassin's Creed IV -> Sandbox
        (15, 10, TRUE), -- Assassin's Creed IV -> Aventura gráfica
        (16, 9, TRUE),  -- Far Cry 5 -> Sandbox
        (16, 8, TRUE),  -- Far Cry 5 -> Battle Royale
        (17, 15, TRUE), -- Spider-Man -> Lucha
        (18, 9, TRUE),  -- Watch Dogs -> Sandbox
        (18, 8, TRUE),  -- Watch Dogs -> Battle Royale
        (19, 1, TRUE),  -- Call of Duty: Modern Warfare -> Shooter
        (20, 10, TRUE), -- The Last of Us -> Aventura gráfica
        (20, 13, TRUE), -- The Last of Us -> Terror
        (21, 13, TRUE), -- Bloodborne -> Terror
        (21, 14, TRUE), -- Bloodborne -> Metroidvania
        (22, 12, TRUE), -- Final Fantasy VII -> Carreras (por minijuego)
        (22, 10, TRUE), -- Final Fantasy VII -> Aventura gráfica
        (23, 16, TRUE), -- Kingdom Hearts -> Roguelike
        (23, 10, TRUE), -- Kingdom Hearts -> Aventura gráfica
        (24, 9, TRUE),  -- Skyrim -> Sandbox
        (24, 16, TRUE), -- Skyrim -> Roguelike
        (25, 2, TRUE),  -- Resident Evil 2 -> Survival Horror
        (25, 13, TRUE), -- Resident Evil 2 -> Terror
        (26, 16, TRUE), -- Monster Hunter: World -> Roguelike
        (27, 14, TRUE), -- Hollow Knight -> Metroidvania
        (28, 11, TRUE), -- Celeste -> Puzzle
        (28, 14, TRUE), -- Celeste -> Metroidvania
        (29, 9, TRUE),  -- Stardew Valley -> Sandbox
        (29, 4, TRUE),  -- Stardew Valley -> Simulación
        (30, 9, TRUE),  -- No Man's Sky -> Sandbox
        (30, 4, TRUE),  -- No Man's Sky -> Simulación
        (31, 9, TRUE),  -- Dying Light -> Sandbox
        (31, 2, TRUE);  -- Dying Light -> Survival Horror

      `
    );
  }


  existe = false;
  res = await db.get(
    "SELECT count(*) as contar FROM sqlite_schema WHERE type = 'table' and name= 'JuegosxPlataformas'",
    []
  );
  if (res.contar > 0) existe = true;
  if (!existe) {
    await db.run(
      "CREATE table JuegosxPlataformas(  IdJuego INTEGER, IdPlataforma INTEGER, Activo BOOL DEFAULT TRUE, PRIMARY KEY (IdJuego, IdPlataforma), FOREIGN KEY (IdJuego) REFERENCES Juegos(IdJuego), FOREIGN KEY (IdPlataforma) REFERENCES plataformas(IdPlataforma));"
    );
    console.log("tabla JuegosxPlataformas creada!");
    await db.run(
      `
      INSERT INTO JuegosxPlataformas (IdJuego, IdPlataforma, Activo) VALUES
        (1, 4, TRUE),  -- Super Mario Bros. en Nintendo Switch
        (2, 4, TRUE),  -- The Legend of Zelda en Nintendo Switch
        (3, 2, TRUE),  -- Grand Theft Auto V en PlayStation 4
        (4, 2, TRUE),  -- Red Dead Redemption 2 en PlayStation 4
        (5, 3, TRUE),  -- The Witcher 3: Wild Hunt en Xbox One
        (6, 4, TRUE),  -- Dark Souls en Nintendo Switch
        (7, 5, TRUE),  -- Halo: Combat Evolved en Stadia
        (8, 5, TRUE),  -- Destiny en Stadia
        (9, 6, TRUE),  -- World of Warcraft en PC
        (10, 6, TRUE), -- Overwatch en PC
        (11, 7, TRUE), -- Half-Life 2 en Steam
        (12, 7, TRUE), -- Portal 2 en Steam
        (13, 8, TRUE), -- Fortnite en iOS
        (13, 2, TRUE), -- Fortnite en PlayStation 4
        (14, 8, TRUE), -- Gears of War en iOS
        (15, 9, TRUE), -- Assassin's Creed IV: Black Flag en Android
        (16, 9, TRUE), -- Far Cry 5 en Android
        (17, 10, TRUE), -- Spider-Man en Nintendo 3DS
        (18, 10, TRUE), -- Watch Dogs en Nintendo 3DS
        (19, 11, TRUE), -- Call of Duty: Modern Warfare en Wii U
        (20, 12, TRUE), -- The Last of Us en PlayStation 3
        (21, 4, TRUE),  -- Bloodborne en Nintendo Switch
        (22, 13, TRUE), -- Final Fantasy VII en PlayStation 2
        (23, 13, TRUE), -- Kingdom Hearts en PlayStation 2
        (24, 14, TRUE), -- The Elder Scrolls V: Skyrim en Xbox 360
        (25, 15, TRUE), -- Resident Evil 2 en Oculus Rift
        (26, 16, TRUE), -- Monster Hunter: World en HTC Vive
        (27, 17, TRUE), -- Hollow Knight en Nintendo DS
        (28, 18, TRUE), -- Celeste en PS Vita
        (29, 19, TRUE), -- Stardew Valley en PC
        (30, 6, TRUE),  -- No Man's Sky en PC
        (31, 21, TRUE); -- Dying Light en PlayStation 3

      `
    );
  }

  // cerrar la base
  db.close();
}


CrearBaseSiNoExiste();

module.exports =  CrearBaseSiNoExiste;
