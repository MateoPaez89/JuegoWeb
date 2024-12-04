import axios from 'axios';
import { config } from '../../config';

const API_URL = config.urlServidor;

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { usuario: username, clave: password });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      notifyUsuarioLogueado(response.data.usuario);
    }
    return response.data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('usuario');
  notifyUsuarioLogueado(null);
};

const getUsuarioLogueado = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

let usuarioLogueadoCallbacks = [];

const subscribeUsuarioLogueado = (callback) => {
  usuarioLogueadoCallbacks.push(callback);
  return () => {
    usuarioLogueadoCallbacks = usuarioLogueadoCallbacks.filter(cb => cb !== callback);
  };
};

const notifyUsuarioLogueado = (usuario) => {
  usuarioLogueadoCallbacks.forEach(callback => callback(usuario));
};

const getToken = () => {
  return localStorage.getItem('accessToken');
};

const AuthService = {
  login,
  logout,
  getUsuarioLogueado,
  subscribeUsuarioLogueado,
  getToken
};

export default AuthService;