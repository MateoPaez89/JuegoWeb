import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../auth.services";
import modalService from "../../../services/modalDialog.service";
import AuthContext from "../authentication/AuthContext";
import "./login.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [error, setError] = useState(""); // Estado para el mensaje de error
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleIngresar = async () => {
    if (intentosFallidos >= 3) {
      setError("Demasiados intentos fallidos. Intente nuevamente más tarde.");
      return;
    }

    try {
      const success = await login(usuario, clave);
      if (success) {
        setError(""); // Limpia el mensaje de error si inicia sesión correctamente
        navigate("/inicio");
      } else {
        setIntentosFallidos(intentosFallidos + 1);
        setError("Usuario o clave incorrectos. Intente nuevamente.");
      }
    } catch (error) {
      setIntentosFallidos(intentosFallidos + 1);
      setError("Error al intentar iniciar sesión. Por favor, inténtelo más tarde.");
      console.error("Error al iniciar sesión:", error);
    }
  };

  useEffect(() => {
    AuthService.logout(); // Desloguear al entrar en la página de login
  }, []);

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-form shadow p-5 rounded">
        <div className="text-center mb-4">
          <img
            src="https://getbootstrap.com/docs/5.2/assets/brand/bootstrap-logo.svg"
            alt="Logo"
            width="72"
            height="57"
          />
          <h1 className="h3 mb-3 fw-normal">Por favor ingrese</h1>
        </div>
        {error && <div className="alert alert-danger">{error}</div>} {/* Mensaje de error */}
        <form>
          <div className="form-floating mb-3">
            <input
              type="text"
              autoComplete="off"
              placeholder="usuario"
              onChange={(e) => setUsuario(e.target.value)}
              value={usuario}
              autoFocus
              className="form-control"
              id="usuario"
            />
            <label htmlFor="usuario">Usuario</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              autoComplete="off"
              placeholder="Clave"
              onChange={(e) => setClave(e.target.value)}
              value={clave}
              className="form-control"
              id="clave"
            />
            <label htmlFor="clave">Clave</label>
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              value="remember-me"
              className="form-check-input"
              id="rememberMe"
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Recordarme
            </label>
          </div>
          <button
            className="w-100 btn btn-lg btn-primary mb-3"
            type="button"
            onClick={handleIngresar}
          >
            Ingresar
          </button>
          <p className="text-center text-muted">© 2024</p>
        </form>
      </div>
    </div>
  );
}

export default Login;
