import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import AuthService from "./seguridad/auth.services";
import "../App.css"; // Importa el CSS personalizado

function Menu() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(
    AuthService.getUsuarioLogueado()
  );

  function CambioUsuarioLogueado(_usuarioLogueado) {
    setUsuarioLogueado(_usuarioLogueado);
  }

  useEffect(() => {
    const unsubscribe = AuthService.subscribeUsuarioLogueado(CambioUsuarioLogueado);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        {/* Logo y título */}
        <NavLink className="navbar-brand" to="/inicio">
          <img
            src="/JuegoIcono.png" // Ruta a tu imagen
            alt="Juegos Icon"
            style={{ width: "30px", height: "auto", marginRight: "10px" }}
          />
          Juegos
        </NavLink>

        {/* Botón para dispositivos móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Opciones del menú */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            {/* Enlace Inicio */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/inicio">
                <img
                  src="/IconoInicio.png" // Ruta a tu ícono
                  alt="Inicio Icon"
                  style={{ width: "25px", height: "auto", marginRight: "8px" }}
                />
                Inicio
              </NavLink>
            </li>
            {/* Enlace Desarrolladores */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/desarrolladores">
                <img
                  src="/IconoDesarrolladores.png"
                  alt="Desarrolladores Icon"
                  style={{ width: "25px", height: "auto", marginRight: "8px" }}
                />
                Desarrolladores
              </NavLink>
            </li>
            {/* Enlace Generos */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/generos">
                <img
                  src="/IconoGeneros.png"
                  alt="Generos Icon"
                  style={{ width: "25px", height: "auto", marginRight: "8px" }}
                />
                Generos
              </NavLink>
            </li>
            {/* Enlace Plataformas */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/plataformas">
                <img
                  src="/IconoPlataformas.png"
                  alt="Plataformas Icon"
                  style={{ width: "25px", height: "auto", marginRight: "8px" }}
                />
                Plataformas
              </NavLink>
            </li>
            {/* Enlace Juegos */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/juegos">
                <img
                  src="/IconoJuegos.png"
                  alt="Juegos Icon"
                  style={{ width: "25px", height: "auto", marginRight: "8px" }}
                />
                Juegos
              </NavLink>
            </li>
          </ul>

          {/* Sección de usuario */}
          <ul className="navbar-nav ms-auto">
            {usuarioLogueado && (
              <li className="nav-item">
                <span className="nav-link">Bienvenido: {usuarioLogueado.usuario}</span>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                <span
                  className={usuarioLogueado ? "text-warning" : "text-success"}
                >
                  <i
                    className={
                      usuarioLogueado ? "fa fa-sign-out" : "fa fa-sign-in"
                    }
                  ></i>
                </span>
                {usuarioLogueado ? " Logout" : " Login"}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
