// src/config.js
const urlServidor = "http://localhost:4000"; 

const urlResourceJuegos = urlServidor + "/api/juegos";
const urlResourceDesarrolladores = urlServidor + "/api/desarrolladores";
const urlResourceGeneros = urlServidor + "/api/generos";
const urlResourcePlataformas = urlServidor + "/api/plataformas";
const urlResourceAuth = urlServidor + "/api/auth";

export const config = {
    urlServidor,
    urlResourceJuegos,
    urlResourceDesarrolladores,
    urlResourceGeneros,
    urlResourcePlataformas,
    urlResourceAuth
};