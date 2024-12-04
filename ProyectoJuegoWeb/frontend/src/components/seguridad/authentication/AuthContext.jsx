import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../auth.services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioLogueado = AuthService.getUsuarioLogueado();
    if (usuarioLogueado) {
      setUsuario(usuarioLogueado);
      console.log("Usuario logueado:", usuarioLogueado); // Agregar console.log para verificar el usuario logueado
    }
  }, []);

  const login = async (usuario, clave) => {
    const token = await AuthService.login(usuario, clave);
    if (token) {
      const usuarioLogueado = AuthService.getUsuarioLogueado();
      setUsuario(usuarioLogueado);
      console.log("Usuario logueado después de login:", usuarioLogueado); // Agregar console.log para verificar el usuario logueado después de login
      return true;
    }
    return false;
  };

  const logout = () => {
    AuthService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;