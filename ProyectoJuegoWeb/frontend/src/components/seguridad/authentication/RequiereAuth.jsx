import { Navigate } from "react-router-dom";
import AuthService from "../auth.services";

function RequireAuth({ children }) {
  let usuarioLogueado = AuthService.getUsuarioLogueado();

  // verificar la autenticacion
  if (!usuarioLogueado) {
    return <Navigate to="/login" />;
  }

  // un nivel mas de seguridad seria verificar la autorizacion...
  return children;
}

export default RequireAuth;