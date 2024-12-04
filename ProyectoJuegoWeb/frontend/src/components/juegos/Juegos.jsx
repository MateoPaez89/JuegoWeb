import { useState, useEffect } from "react";
import JuegosBuscar from "./JuegosBuscar";
import JuegosListado from "./JuegosListado";
import JuegosRegistro from "./JuegosRegistro";
import juegosService from "../../services/juegos.services";
import desarrolladoresService from "../../services/desarrolladores.services";
import generosService from "../../services/generos.services";
import plataformasService from "../../services/plataformas.serivices";
import modalDialogService from "../../services/modalDialog.service";

function Juegos() {
  const TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)",
  };
  const [AccionABMC, setAccionABMC] = useState("L");

  const [Nombre, setNombre] = useState("");
  const [Activo, setActivo] = useState(null); // Cambiar a null para incluir todos los juegos

  const [Items, setItems] = useState([]);
  const [Item, setItem] = useState(null); // usado en BuscarporId (Modificar, Consultar)
  const [RegistrosTotal, setRegistrosTotal] = useState(0);
  const [Pagina, setPagina] = useState(1);
  const [Paginas, setPaginas] = useState([]);
  const [desarrolladores, setDesarrolladores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function BuscarDatos() {
      await Buscar();
    }
    BuscarDatos();
  }, []);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const desarrolladoresData = await desarrolladoresService.Buscar("", true, 1);
        setDesarrolladores(desarrolladoresData.Items);

        const generosData = await generosService.Buscar("", true, 1);
        setGeneros(generosData.Items);

        const plataformasData = await plataformasService.Buscar("", true, 1);
        setPlataformas(plataformasData.Items);
      } catch (error) {
        setError(error.message);
        modalDialogService.Alert(error.message);
      }
    }
    cargarDatos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // El mensaje de error desaparecerá después de 5 segundos

      return () => clearTimeout(timer);
    }
  }, [error]);

  async function Buscar(_pagina) {
    if (_pagina && _pagina !== Pagina) {
      setPagina(Number(_pagina)); // Convertir a número
    } else {
      _pagina = Pagina;
    }
    modalDialogService.BloquearPantalla(true);
    try {
      const data = await juegosService.Buscar(Nombre, Activo, _pagina);
      setItems(data.Items);
      setRegistrosTotal(data.RegistrosTotal);

      const arrPaginas = [];
      for (let i = 1; i <= Math.ceil(data.RegistrosTotal / 10); i++) {
        arrPaginas.push(i);
      }
      setPaginas(arrPaginas);
    } catch (error) {
      setError(error.message);
      modalDialogService.Alert(error.message);
    } finally {
      modalDialogService.BloquearPantalla(false);
    }
  }

  async function BuscarPorId(item, accionABMC) {
    try {
      const data = await juegosService.BuscarPorId(item);
      setItem(data);
      setAccionABMC(accionABMC);
    } catch (error) {
      setError(error.message);
      modalDialogService.Alert(error.message);
    }
  }

  function Consultar(item) {
    BuscarPorId(item, "C");
  }

  function Modificar(item) {
    if (!item.Activo) {
      modalDialogService.Alert("No puede modificarse un registro Inactivo.");
      return;
    }
    BuscarPorId(item, "M");
  }

  async function Agregar() {
    setAccionABMC("A");
    setItem({
      IdJuego: 0,
      Nombre: "",
      FechaLanzamiento: "",
      Precio: 0.0,
      Activo: false, // Establecer el valor de activo a false por defecto
      IdDesarrollador: "",
      Generos: [],
      Plataformas: [],
    });
  }

  async function ActivarDesactivar(item) {
    try {
      await juegosService.ActivarDesactivar(item);
      await Buscar();
      modalDialogService.Alert(
        `Registro ${item.Activo ? "activado" : "desactivado"} correctamente.`
      );
    } catch (error) {
      setError(error.message);
      modalDialogService.Alert(error.message);
    }
  }

  async function Grabar(item) {
    try {
      await juegosService.Grabar(item);
      await Buscar();
      Volver();
      modalDialogService.Alert(
        "Registro " +
          (AccionABMC === "A" ? "agregado" : "modificado") +
          " correctamente."
      );
    } catch (error) {
      setError(error.message);
      modalDialogService.Alert(error.message);
    }
  }

  function Volver() {
    setAccionABMC("L");
  }

  return (
    <div>
      <div className="tituloPagina">
        Juegos <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {AccionABMC === "L" && (
        <JuegosBuscar
          Nombre={Nombre}
          setNombre={setNombre}
          Activo={Activo}
          setActivo={setActivo}
          Buscar={Buscar}
          Agregar={Agregar}
        />
      )}

      {AccionABMC === "L" && Items?.length > 0 && (
        <JuegosListado
          {...{
            Items,
            Consultar,
            Modificar,
            ActivarDesactivar,
            Pagina,
            RegistrosTotal,
            Paginas,
            Buscar,
          }}
        />
      )}

      {AccionABMC === "L" && Items?.length === 0 && (
        <div className="alert alert-info mensajesAlert">
          <i className="fa fa-exclamation-sign"></i>
          No se encontraron registros...
        </div>
      )}

      {AccionABMC !== "L" && (
        <JuegosRegistro
          {...{ AccionABMC, Item, Grabar, Volver, desarrolladores, generos, plataformas }}
        />
      )}
    </div>
  );
}

export default Juegos;