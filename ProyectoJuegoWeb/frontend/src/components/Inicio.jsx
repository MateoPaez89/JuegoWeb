import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Inicio() {
  return (
    <div
      className="mt-4 text-white rounded shadow-lg d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('/juegosInicio.jpg')", // Ruta relativa a la carpeta public
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "80vh",
      }}
    >
      <div
        className="container text-center"
        style={{
          maxWidth: "700px", // Ajuste de tamaño para dar más espacio
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo más oscuro para contraste
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // Agrega un poco de sombra para darle profundidad
        }}
      >
        <h1 className="display-5 fw-bold" style={{ color: "#e3e3e3" }}>
          Bienvenido al Mundo de los Videojuegos
        </h1>
        <p className="lead" style={{ color: "#d1d1d1" }}>
          Sumérgete en un vasto universo de juegos, desde aventuras épicas hasta
          desafíos deportivos. Aquí encontrarás una extensa variedad de géneros,
          plataformas y desarrolladores que han dado vida a estos mundos. 
          ¡Explora, descubre y disfruta de una experiencia única!
        </p>
        <Link to="/desarrolladores" className="btn btn-primary mt-3">
          Empezar a Explorar
        </Link>
      </div>
    </div>
  );
}

export default Inicio;