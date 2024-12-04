import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Inicio from "./components/Inicio";
import Menu from "./components/Menu";
import { Footer } from "./components/Footer";
import Juegos from "./components/juegos/Juegos";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import Desarrolladores from "./components/desarrolladores/Desarrolladores";
import Generos from "./components/generos/Generos";
import Plataformas from "./components/plataformas/Plataformas"; 
import { AuthProvider } from "./components/seguridad/authentication/AuthContext"; // Asegúrate de importar AuthProvider como default
import Login from "./components/seguridad/login/Login"; // Asegúrate de importar Login como default
import { ModalDialog } from "./components/ModalDialog"; // Importa el componente ModalDialog

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Menu />
          <div className="main-content">
            <Routes>
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/juegos" element={<Juegos />} />
              <Route path="/desarrolladores" element={<Desarrolladores />} />
              <Route path="/generos" element={<Generos />} />
              <Route path="/plataformas" element={<Plataformas />} />
              <Route path="*" element={<Navigate to="/inicio" replace />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Footer />
        </div>
        <ModalDialog /> {/* Agrega el componente ModalDialog aquí */}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;