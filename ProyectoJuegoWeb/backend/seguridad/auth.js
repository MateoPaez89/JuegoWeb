const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { usuarios } = require("../base-orm/modulos"); // Asegúrate de que esta ruta sea correcta

const accessTokenSecret = "youraccesstokensecret";
const refreshTokenSecret = "yourrefreshtokensecrethere";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "token no es valido" });
      }
      
      res.locals.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Acceso denegado" });
  }
};

const login = async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    const user = await usuarios.findOne({ where: { Usuario: usuario } });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña hasheada
    const match = await bcrypt.compare(clave, user.Clave);
    if (!match) {
      return res.status(401).json({ message: "Clave incorrecta" });
    }

    const accessToken = jwt.sign({ usuario: user.Usuario, rol: user.Rol }, accessTokenSecret, { expiresIn: '20m' });
    const refreshToken = jwt.sign({ usuario: user.Usuario, rol: user.Rol }, refreshTokenSecret);

    res.json({
      accessToken,
      refreshToken,
      usuario: { id: user.IdUsuario, usuario: user.Usuario, rol: user.Rol }
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { authenticateJWT, login, accessTokenSecret, refreshTokenSecret };